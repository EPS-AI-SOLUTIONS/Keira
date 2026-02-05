"""
Keira - FastAPI Main Application
Regis Architecture v2.9.0
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import (
    frame_router,
    health_router,
    process_router,
    upload_router,
    video_router,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# App
app = FastAPI(
    title="Keira API",
    description="AI-powered video watermark removal",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(frame_router, prefix="/api", tags=["frame"])
app.include_router(process_router, prefix="/api", tags=["process"])
app.include_router(video_router, prefix="/api", tags=["video"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8002)
