from __future__ import annotations

import os

import redis


def get_client() -> redis.Redis:
    return redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=int(os.getenv("REDIS_PORT", "6379")), decode_responses=True)
