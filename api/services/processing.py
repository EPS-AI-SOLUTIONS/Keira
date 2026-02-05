"""
Keira - Processing Service
Regis Architecture v2.9.0
"""

import asyncio
import logging
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from typing import TYPE_CHECKING

from ..config import CRF_MAP, JOBS_DIR, PRESET_MAP, WORKER_DIR
from ..models import ProcessingProgress, ProcessingStage
from .ffmpeg import encode_video, extract_all_frames

if TYPE_CHECKING:
    from ..models import JobData, VideoData

logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor(max_workers=4)


async def run_processing(
    job_id: str,
    jobs: dict[str, "JobData"],
    videos: dict[str, "VideoData"],
) -> None:
    """Run the inpainting pipeline."""
    if job_id not in jobs:
        return

    job = jobs[job_id]
    video_data = videos.get(job.video_id)

    if not video_data:
        job.status = ProcessingStage.ERROR
        job.error = "Video not found"
        return

    job_dir = JOBS_DIR / job_id
    frames_dir = job_dir / "frames"
    frames_out = job_dir / "frames_out"

    try:
        # Stage 1: Extract frames
        job.status = ProcessingStage.EXTRACTING
        job.progress = ProcessingProgress(
            stage=ProcessingStage.EXTRACTING,
            percent=0,
            message="Extracting frames...",
        )

        frames_dir.mkdir(parents=True, exist_ok=True)
        frames_out.mkdir(parents=True, exist_ok=True)

        # Run extraction in thread pool
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            executor, extract_all_frames, video_data.path, frames_dir
        )

        if job.cancelled:
            return

        job.progress.percent = 25
        job.progress.message = "Frames extracted"

        # Stage 2: Inpainting
        job.status = ProcessingStage.INPAINTING
        job.progress.stage = ProcessingStage.INPAINTING
        job.progress.message = "Running AI inpainting..."

        # Find worker python
        worker_py = WORKER_DIR / ".venv" / "Scripts" / "python.exe"
        if not worker_py.exists():
            worker_py = WORKER_DIR / ".venv" / "bin" / "python"

        if not worker_py.exists():
            raise RuntimeError("Worker venv not found")

        model_path = WORKER_DIR / "models" / "lama_fp32.onnx"
        if not model_path.exists():
            raise RuntimeError("Model not found")

        # Build inpainting command
        roi = job.roi
        cmd = [
            str(worker_py),
            str(WORKER_DIR / "inpaint_worker.py"),
            "--frames",
            str(frames_dir),
            "--out",
            str(frames_out),
            "--roi",
            f"{roi.x},{roi.y},{roi.width},{roi.height}",
            "--model",
            str(model_path),
            "--mask",
            str(job.mask_path),
            "--ext",
            ".png",
            "--batch-size",
            str(job.settings.batchSize),
            "--io-workers",
            str(job.settings.ioWorkers),
        ]

        # Run inpainting with progress parsing
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
        )

        async for line in process.stdout:
            if job.cancelled:
                process.terminate()
                return

            line_str = line.decode().strip()
            if line_str.startswith("PROGRESS:"):
                try:
                    parts = line_str.split(":")
                    if len(parts) >= 7:
                        pct = int(parts[1])
                        current = int(parts[2])
                        total = int(parts[3])
                        fps = float(parts[4])
                        eta = parts[5]

                        # Map 0-100% to 25-90%
                        overall_pct = 25 + int(pct * 0.65)
                        job.progress = ProcessingProgress(
                            stage=ProcessingStage.INPAINTING,
                            percent=overall_pct,
                            currentFrame=current,
                            totalFrames=total,
                            fps=fps,
                            eta=eta,
                            message=f"AI painting: {current}/{total} frames",
                        )
                except Exception:
                    pass

        await process.wait()

        if process.returncode != 0:
            stderr = await process.stderr.read()
            raise RuntimeError(f"Inpainting failed: {stderr.decode()}")

        if job.cancelled:
            return

        # Stage 3: Encode video
        job.status = ProcessingStage.ENCODING
        job.progress = ProcessingProgress(
            stage=ProcessingStage.ENCODING,
            percent=90,
            message="Encoding video...",
        )

        output_path = job_dir / "output.mp4"

        crf = CRF_MAP.get(job.settings.quality, 18)
        preset = PRESET_MAP.get(job.settings.quality, "medium")

        await loop.run_in_executor(
            executor,
            encode_video,
            frames_out,
            video_data.info.fps,
            video_data.path,
            output_path,
            crf,
            preset,
        )

        if job.cancelled:
            return

        # Complete
        job.status = ProcessingStage.COMPLETE
        job.output_path = output_path
        job.progress = ProcessingProgress(
            stage=ProcessingStage.COMPLETE,
            percent=100,
            message="Complete!",
        )

        logger.info(f"Job completed: {job_id}")

    except Exception as e:
        logger.exception(f"Job failed: {job_id}")
        job.status = ProcessingStage.ERROR
        job.error = str(e)
        job.progress = ProcessingProgress(
            stage=ProcessingStage.ERROR,
            message=str(e),
        )
