import os
import aioredis
import uvicorn

from fastapi import Depends, FastAPI, Request
from fastapi.security import APIKeyHeader
from fastapi_simple_security import api_key_router, api_key_security
from fastapi_simple_security.security_api_key import api_key_header
from fastapi_limiter import FastAPILimiter

from grrm import router as api_scan

# from scan_analytics import router as api_analytics

API_PREFIX = os.environ.get("PUBLIC_API_PREFIX", "/scan-api")

api = FastAPI(
    title="SCAN API",
    description="This is the API description for SCAN database.",
    version="0.1.2 alpha",
)

# print(api_key_header.model.name)
api_key_header.model.name = "x-api-key"

api.include_router(api_key_router, prefix="/auth", tags=["_auth"])


# @api.get("/")
# async def dashboard():
#     # return {"api_scan": "grrm", "api_analytics": "analytics"}
#     return {
#         "api_scan": "grrm",
#     }

print("PUBLIC_API_PREFIX:", API_PREFIX)

api.include_router(
    api_scan.router,
    prefix=API_PREFIX,
    tags=["scan"],
    dependencies=[Depends(api_key_security)],
)


async def limit_identifier(request: Request):
    api_key = request.headers.get("X-API-Key")
    print(api_key)
    if api_key:
        return api_key
    return request.client.host


@api.on_event("startup")
async def startup():
    redis = await aioredis.create_redis_pool("redis://redis")
    FastAPILimiter.init(redis, identifier=limit_identifier)
    print("connected to redis")


# api.include_router(
#     api_analytics.router,
#     prefix="/analytics",
#     tags=["analytics"],
# )

if __name__ == "__main__":
    uvicorn.run(api, host="0.0.0.0", port=8000)
