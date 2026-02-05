"""
Keira - Configuration
Regis Architecture v2.9.0
"""

import tempfile
from pathlib import Path

# Paths
WORK_DIR = Path(tempfile.gettempdir()) / "keira_web"
UPLOADS_DIR = WORK_DIR / "uploads"
JOBS_DIR = WORK_DIR / "jobs"
WORKER_DIR = Path(__file__).parent.parent / "worker"

# Create directories
WORK_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
JOBS_DIR.mkdir(parents=True, exist_ok=True)

# Supported formats
SUPPORTED_VIDEO_FORMATS = [".mp4", ".mkv", ".mov", ".webm", ".avi"]

# Quality presets
CRF_MAP = {"draft": 28, "standard": 23, "high": 18, "lossless": 0}
PRESET_MAP = {
    "draft": "ultrafast",
    "standard": "medium",
    "high": "medium",
    "lossless": "veryslow",
}
