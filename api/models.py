"""
Keira - Pydantic Models
Regis Architecture v2.9.0
"""

from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Optional

from pydantic import BaseModel


class ProcessingStage(str, Enum):
    """Video processing stages."""

    IDLE = "idle"
    UPLOADING = "uploading"
    EXTRACTING = "extracting"
    INPAINTING = "inpainting"
    ENCODING = "encoding"
    COMPLETE = "complete"
    ERROR = "error"


class ROI(BaseModel):
    """Region of interest for watermark removal."""

    x: int
    y: int
    width: int
    height: int


class ExportSettings(BaseModel):
    """Video export settings."""

    quality: str = "high"
    batchSize: int = 8
    ioWorkers: int = 4


class VideoInfo(BaseModel):
    """Video metadata."""

    id: str
    name: str
    path: str
    duration: float
    fps: float
    width: int
    height: int
    size: int


class ProcessingProgress(BaseModel):
    """Processing progress information."""

    stage: ProcessingStage
    percent: int = 0
    currentFrame: int = 0
    totalFrames: int = 0
    fps: float = 0.0
    eta: str = "--:--"
    message: str = ""


class StartProcessingRequest(BaseModel):
    """Request to start video processing."""

    videoId: str
    roi: ROI
    maskDataUrl: str
    settings: ExportSettings


# In-memory state dataclasses
@dataclass
class VideoData:
    """Video data container."""

    info: VideoInfo
    path: Path


@dataclass
class JobData:
    """Job data container."""

    id: str
    video_id: str
    roi: ROI
    mask_path: Path
    settings: ExportSettings
    status: ProcessingStage = ProcessingStage.IDLE
    progress: ProcessingProgress = field(
        default_factory=lambda: ProcessingProgress(stage=ProcessingStage.IDLE)
    )
    output_path: Optional[Path] = None
    error: Optional[str] = None
    cancelled: bool = False
