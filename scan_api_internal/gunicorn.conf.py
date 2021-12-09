import os

bind = '0.0.0.0:8000'

# Worker Processes
workers = 2 * os.cpu_count() + 1
threads = 2 * os.cpu_count() + 1
worker_class = 'uvicorn.workers.UvicornWorker'

print("workers: ", workers)