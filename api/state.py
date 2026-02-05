"""
Keira - Global State
Regis Architecture v2.9.0
"""

from .models import JobData, VideoData

# In-memory state
videos: dict[str, VideoData] = {}
jobs: dict[str, JobData] = {}
