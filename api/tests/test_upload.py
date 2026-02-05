from api.state import videos


def test_upload_video_success(client, mock_video_info):
    """Test successful video upload."""
    file_content = b"fake video content"
    files = {"file": ("test.mp4", file_content, "video/mp4")}

    response = client.post("/api/upload", files=files)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "test.mp4"
    assert data["width"] == 1920
    assert "id" in data

    # Check if state was updated
    assert data["id"] in videos


def test_upload_invalid_extension(client):
    """Test upload with unsupported extension."""
    file_content = b"fake content"
    files = {"file": ("test.txt", file_content, "text/plain")}

    response = client.post("/api/upload", files=files)

    assert response.status_code == 400
    assert "Unsupported format" in response.json()["detail"]


def test_upload_no_filename(client):
    """Test upload without filename."""
    file_content = b"content"
    # Empty filename
    files = {"file": ("", file_content, "video/mp4")}

    response = client.post("/api/upload", files=files)

    assert response.status_code == 422
