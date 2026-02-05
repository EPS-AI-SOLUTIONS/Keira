from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_health_check():
    """
    Testuje endpoint health check.
    Oczekuje statusu 200 i poprawnej struktury odpowiedzi.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
