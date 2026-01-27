from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Innovation Platform API"}

def test_auth_endpoints_structure():
    # Only verify that routes exist, not implementation logic (requires DB)
    assert app.url_path_for("login_access_token") == "/auth/login"
    assert app.url_path_for("register_user") == "/auth/register"
