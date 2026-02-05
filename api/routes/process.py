"""
Keira - Process Route
Regis Architecture v2.9.0
"""

import base64
import logging
import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse

from ..config import JOBS_DIR
from ..models import (
    JobData,
    ProcessingProgress,
    ProcessingStage,
    StartProcessingRequest,
)
from ..services.processing import run_processing
from ..state import jobs, videos

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/process/start")
async def start_processing(
    request: StartProcessingRequest, background_tasks: BackgroundTasks
):
    """Start video processing job."""
    if request.videoId not in videos:
        raise HTTPException(404, "Video not found")

    job_id = str(uuid.uuid4())

    # Create job directory
    job_dir = JOBS_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    # Decode and save mask
    mask_data = request.maskDataUrl
    if mask_data.startswith("data:"):
        mask_data = mask_data.split(",", 1)[1]

    mask_bytes = base64.b64decode(mask_data)
    mask_path = job_dir / "mask.png"
    mask_path.write_bytes(mask_bytes)

    # Create job
    job = JobData(
        id=job_id,
        video_id=request.videoId,
        roi=request.roi,
        mask_path=mask_path,
        settings=request.settings,
        status=ProcessingStage.EXTRACTING,
        progress=ProcessingProgress(
            stage=ProcessingStage.EXTRACTING, message="Starting..."
        ),
    )
    jobs[job_id] = job

    # Start processing in background
    background_tasks.add_task(run_processing, job_id, jobs, videos)

    logger.info(f"Started job: {job_id}")
    return {"jobId": job_id}


@router.get("/process/status/{job_id}")
async def get_processing_status(job_id: str):
    """Get job status."""
    if job_id not in jobs:
        raise HTTPException(404, "Job not found")

    job = jobs[job_id]

    response = {
        "jobId": job_id,
        "status": job.status.value,
        "progress": job.progress.model_dump(),
    }

    if job.output_path:
        response["outputUrl"] = f"/api/process/download/{job_id}"

    if job.error:
        response["error"] = job.error

    return response


@router.post("/process/cancel/{job_id}")
async def cancel_processing(job_id: str):
    """Cancel a processing job."""
    if job_id not in jobs:
        raise HTTPException(404, "Job not found")

    jobs[job_id].cancelled = True
    logger.info(f"Cancelled job: {job_id}")
    return {"status": "cancelled"}


@router.get("/process/download/{job_id}")
async def download_output(job_id: str):
    """Download processed video."""
    if job_id not in jobs:
        raise HTTPException(404, "Job not found")

    job = jobs[job_id]
    if not job.output_path or not job.output_path.exists():
        raise HTTPException(404, "Output not available")

    return FileResponse(
        job.output_path,
        media_type="video/mp4",
        filename=f"keira_output_{job_id[:8]}.mp4",
    )
