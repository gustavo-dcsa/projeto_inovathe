from app.core import security
from datetime import timedelta

def test_hash_password():
    password = "secret_password"
    hashed = security.get_password_hash(password)
    assert hashed != password
    assert security.verify_password(password, hashed)

def test_create_access_token():
    data = {"sub": "test@example.com"}
    token = security.create_access_token(data)
    assert isinstance(token, str)
    assert len(token) > 0

def test_create_access_token_with_expiry():
    data = {"sub": "test@example.com"}
    expires = timedelta(minutes=10)
    token = security.create_access_token(data, expires)
    assert isinstance(token, str)
