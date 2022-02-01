import os

API_WORKERS = os.environ.get("API_WORKERS", os.cpu_count() + 1)

bind = '0.0.0.0:8000'

# Worker Processes
workers = API_WORKERS
threads = 2 * os.cpu_count() + 1
worker_class = 'uvicorn.workers.UvicornWorker'

print("workers: ", workers)