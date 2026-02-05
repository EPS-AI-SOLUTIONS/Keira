import shutil
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from api import config
from api.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_video_info():
    with patch("api.routes.upload.get_video_info") as mock:
        mock.return_value = {
            "duration": 120.5,
            "fps": 30.0,
            "width": 1920,
            "height": 1080,
        }
        yield mock


@pytest.fixture(autouse=True)
def clean_uploads():
    """Clean uploads directory before and after tests."""
    # Setup
    if config.UPLOADS_DIR.exists():
        shutil.rmtree(config.UPLOADS_DIR)
    config.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    yield

    # Teardown
    if config.UPLOADS_DIR.exists():
        shutil.rmtree(config.UPLOADS_DIR)
        config.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
