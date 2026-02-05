"""
Keira - Frame Route
Regis Architecture v2.9.0
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..config import UPLOADS_DIR
from ..services.ffmpeg import extract_frame
from ..state import videos

router = APIRouter()


@router.get("/frame/{video_id}")
async def get_frame(video_id: str, time: float = 0):
    """Get a frame from the video at specified time."""
    if video_id not in videos:
        raise HTTPException(404, "Video not found")

    video_data = videos[video_id]
    frame_path = UPLOADS_DIR / video_id / f"frame_{time:.2f}.jpg"

    # Extract frame if not cached
    if not frame_path.exists():
        extract_frame(video_data.path, time, frame_path)

    if not frame_path.exists():
        raise HTTPException(500, "Failed to extract frame")

    return FileResponse(frame_path, media_type="image/jpeg")
