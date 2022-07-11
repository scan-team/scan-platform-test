FROM scan_api_internal-dev

# add to application
COPY app.py ./
ADD service service
ADD scan_analytics scan_analytics
ADD grrm grrm
ADD python-scripts python-scripts

ADD gunicorn.conf.py ./

EXPOSE 8000
# CMD ["uvicorn", "app:api", "--host", "0.0.0.0", "--port", "8000", "--root-path", "echo '/api'"]
# CMD uvicorn app:api --host 0.0.0.0 --port 8000 --root-path $ROOT_PATH
# CMD uvicorn app:api --host 0.0.0.0 --port 8000
# CMD gunicorn app:api --config gunicorn.conf.py
CMD ["conda", "run", "--no-capture-output", "-n", "scan-env", "gunicorn", "app:api", "--config", "gunicorn.conf.py"]