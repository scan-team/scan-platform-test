import os
import uvicorn
from dotenv import load_dotenv


from fastapi import Depends, FastAPI, Request

from fastapi_limiter import FastAPILimiter
from fastapi.middleware.cors import CORSMiddleware

from grrm import router as api_scan

load_dotenv()


# from scan_analytics import router as api_analytics

API_PREFIX = os.environ.get("API_PREFIX", "/scan-api")
API_PORT = os.environ.get("API_PORT", 8000)

api = FastAPI(
    title="SCAN Internal API",
    description="This is the API description for SCAN database.",
    version="0.1.2 alpha",
)



api.include_router(
    api_scan.router,
    prefix=API_PREFIX,
    tags=["scan"],
    # dependencies=[Depends(api_key_security)],
)


async def limit_identifier(request: Request):
    api_key = request.headers.get("X-API-Key")
    print(api_key)
    if api_key:
        return api_key
    return request.client.host

origins = os.environ.get("API_ALLOWED_HOSTS").split(" ")

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(api, host="0.0.0.0", port=int(API_PORT))
