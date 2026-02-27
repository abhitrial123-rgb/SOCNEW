from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Dict

from jose import jwt
from passlib.context import CryptContext

from app.models.schemas import Role

SECRET_KEY = "super-secret-change-me"
ALGO = "HS256"

pwd_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

_users: Dict[str, dict] = {
    "analyst": {"password": pwd_ctx.hash("analyst123"), "role": Role.analyst, "tenant_id": "tenant-a"},
    "manager": {"password": pwd_ctx.hash("manager123"), "role": Role.manager, "tenant_id": "tenant-a"},
    "admin": {"password": pwd_ctx.hash("admin123"), "role": Role.admin, "tenant_id": "tenant-root"},
}


def verify_password(password: str, hashed: str) -> bool:
    return pwd_ctx.verify(password, hashed)


def authenticate(username: str, password: str) -> dict | None:
    user = _users.get(username)
    if not user or not verify_password(password, user["password"]):
        return None
    return {"username": username, **user}


def create_token(user: dict) -> str:
    payload = {
        "sub": user["username"],
        "role": user["role"],
        "tenant_id": user["tenant_id"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGO)
