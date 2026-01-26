# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Final Image ---
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements from backend subfolder
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend code
COPY backend/ ./

# Copy built frontend files from Stage 1 into the 'static' folder Flask expects
COPY --from=frontend-builder /frontend/dist ./static

# Expose port (Hugging Face Spaces standard)
ENV PORT=7860
EXPOSE 7860

# Run the app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--threads", "2", "--timeout", "120", "app:app"]
