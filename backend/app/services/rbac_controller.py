from __future__ import annotations

from fastapi import HTTPException

from app.models.schemas import Role


ROLE_ORDER = {Role.analyst: 1, Role.manager: 2, Role.admin: 3}


def enforce_role(user: dict, required: Role) -> None:
    if ROLE_ORDER[user["role"]] < ROLE_ORDER[required]:
        raise HTTPException(status_code=403, detail="Insufficient privileges")
