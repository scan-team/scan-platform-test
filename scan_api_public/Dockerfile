FROM scan_api_public-dev

# add to application
ADD app.py /
ADD service service
ADD scan_analytics scan_analytics
ADD grrm grrm
# ADD sqlite.db sqlite.db
ADD keyfiles keyfiles

# ARG root_path=aaa
# ENV ROOT_PATH=$root_path

# RUN echo "${ROOT_PATH}"
RUN echo $PUBLIC_API_ROOT_PATH

EXPOSE 8000
#CMD ["uvicorn", "app:api", "--host", "0.0.0.0", "--port", "8000", "--root-path", "echo '/api'"]
CMD uvicorn app:api --host 0.0.0.0 --port 8000 --root-path $PUBLIC_API_ROOT_PATH