"""
Keira - API Routes
Regis Architecture v2.9.0
"""

from .frame import router as frame_router
from .health import router as health_router
from .process import router as process_router
from .upload import router as upload_router
from .video import router as video_router

__all__ = [
    "health_router",
    "upload_router",
    "frame_router",
    "process_router",
    "video_router",
]
