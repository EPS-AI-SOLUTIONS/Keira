"""
Keira - FFmpeg Utilities
Regis Architecture v2.9.0
"""

import subprocess
import sys
from pathlib import Path


def run_ffprobe(args: list[str]) -> str:
    """Run ffprobe command and return output."""
    cmd = ["ffprobe", "-v", "error"] + args
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffprobe failed: {result.stderr}")
    return result.stdout.strip()


def get_video_info(path: Path) -> dict:
    """Extract video metadata using ffprobe."""
    duration = float(
        run_ffprobe(
            [
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(path),
            ]
        )
    )

    fps_str = run_ffprobe(
        [
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=r_frame_rate",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ]
    )
    if "/" in fps_str:
        num, den = fps_str.split("/")
        fps = float(num) / float(den)
    else:
        fps = float(fps_str) if fps_str else 30.0

    dims = run_ffprobe(
        [
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "csv=p=0:s=x",
            str(path),
        ]
    )
    width, height = map(int, dims.split("x"))

    return {
        "duration": duration,
        "fps": fps,
        "width": width,
        "height": height,
    }


def extract_frame(video_path: Path, time: float, output_path: Path) -> None:
    """Extract a single frame from video."""
    cmd = [
        "ffmpeg",
        "-y",
        "-ss",
        str(time),
        "-i",
        str(video_path),
        "-frames:v",
        "1",
        "-q:v",
        "2",
        str(output_path),
    ]
    subprocess.run(
        cmd,
        capture_output=True,
        creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
    )


def extract_all_frames(video_path: Path, output_dir: Path) -> None:
    """Extract all frames from video."""
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(video_path),
        str(output_dir / "%06d.png"),
    ]
    subprocess.run(
        cmd,
        capture_output=True,
        creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
    )


def encode_video(
    frames_dir: Path,
    fps: float,
    audio_source: Path,
    output: Path,
    crf: int = 18,
    preset: str = "medium",
) -> None:
    """Encode frames back to video."""
    cmd = [
        "ffmpeg",
        "-y",
        "-framerate",
        str(fps),
        "-i",
        str(frames_dir / "%06d.png"),
        "-i",
        str(audio_source),
        "-map",
        "0:v:0",
        "-map",
        "1:a?",
        "-c:v",
        "libx264",
        "-crf",
        str(crf),
        "-preset",
        preset,
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "copy",
        str(output),
    ]
    subprocess.run(
        cmd,
        capture_output=True,
        creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
    )
