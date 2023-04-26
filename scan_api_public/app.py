# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the Entry Point for the Python App GRRM Data manager for the 
#              scan-api-public parts of the Scan Platform Project 
# ------------------------------------------------------------------------------------------------
# Notes: 
# ------------------------------------------------------------------------------------------------
# References: os, uvucorn, 3rd party FastApi, aioredis
#             and internal grrm support-functions router
# =================================================================================================

# print("This is scan-api-public Entrance Point", flush=True) # TODO: Remove before publish

# -------------------------------------------------------------------------------------------------
# Load required libraries
# -------------------------------------------------------------------------------------------------
import os
import aioredis
import uvicorn
from fastapi import Depends, FastAPI, Request
from fastapi.security import APIKeyHeader
from fastapi_simple_security import api_key_router, api_key_security
from fastapi_simple_security.security_api_key import api_key_header
from fastapi_limiter import FastAPILimiter

from grrm import router as api_scan

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
# public api initiation
# -------------------------------------------------------------------------------------------------
API_PREFIX = os.environ.get("PUBLIC_API_PREFIX", "/scan-api")

api = FastAPI(
    title="SCAN API",
    description="This is the API description for SCAN database.",
    version="0.1.2 alpha",
)

api_key_header.model.name = "x-api-key"

api.include_router(api_key_router, prefix="/auth", tags=["_auth"])

api.include_router(
    api_scan.router,
    prefix=API_PREFIX,
    tags=["scan"],
    dependencies=[Depends(api_key_security)],
)


async def limit_identifier(request: Request):
    api_key = request.headers.get("X-API-Key")
    if api_key:
        return api_key
    return request.client.host


@api.on_event("startup")
async def startup():
    redis = await aioredis.create_redis_pool("redis://redis")
    FastAPILimiter.init(redis, identifier=limit_identifier)


if __name__ == "__main__":
    uvicorn.run(api, host="0.0.0.0", port=8000)

# -------------------------------------------------------------------------------------------------
