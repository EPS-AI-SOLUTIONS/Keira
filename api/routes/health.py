"""
Keira - Health Check Route
Regis Architecture v2.9.0
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
