from __future__ import annotations

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.services.auth_manager import ALGO, SECRET_KEY

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        return {"username": payload["sub"], "role": payload["role"], "tenant_id": payload["tenant_id"]}
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc
