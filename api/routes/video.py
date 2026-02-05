"""
Keira - Video Route
Regis Architecture v2.9.0
"""

import logging
import shutil

from fastapi import APIRouter

from ..config import UPLOADS_DIR
from ..state import videos

logger = logging.getLogger(__name__)
router = APIRouter()


@router.delete("/video/{video_id}")
async def delete_video(video_id: str):
    """Delete uploaded video and associated data."""
    if video_id in videos:
        video_dir = UPLOADS_DIR / video_id
        shutil.rmtree(video_dir, ignore_errors=True)
        del videos[video_id]
        logger.info(f"Deleted video: {video_id}")

    return {"status": "deleted"}
