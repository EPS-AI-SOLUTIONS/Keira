"""
Keira - Upload Route
Regis Architecture v2.9.0
"""

import logging
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from ..config import SUPPORTED_VIDEO_FORMATS, UPLOADS_DIR
from ..models import VideoData, VideoInfo
from ..services.ffmpeg import get_video_info
from ..state import videos

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/upload", response_model=VideoInfo)
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file."""
    if not file.filename:
        raise HTTPException(400, "No filename provided")

    video_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix.lower()

    if ext not in SUPPORTED_VIDEO_FORMATS:
        raise HTTPException(400, f"Unsupported format: {ext}")

    video_dir = UPLOADS_DIR / video_id
    video_dir.mkdir(parents=True, exist_ok=True)
    video_path = video_dir / f"video{ext}"

    # Save uploaded file
    content = await file.read()
    video_path.write_bytes(content)

    # Get video info
    try:
        info = get_video_info(video_path)
    except Exception as e:
        shutil.rmtree(video_dir, ignore_errors=True)
        raise HTTPException(400, f"Invalid video file: {e}")

    video_info = VideoInfo(
        id=video_id,
        name=file.filename,
        path=str(video_path),
        duration=info["duration"],
        fps=info["fps"],
        width=info["width"],
        height=info["height"],
        size=len(content),
    )

    videos[video_id] = VideoData(info=video_info, path=video_path)
    logger.info(f"Uploaded video: {video_id} - {file.filename}")

    return video_info
