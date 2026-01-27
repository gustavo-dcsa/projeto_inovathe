# Backend Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Environment variables should be passed at runtime
# ENV DATABASE_URL=...

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
