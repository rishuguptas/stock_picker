# Base image - Slim version for lower memory usage (Crucial for B4A Free Tier)
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements from the backend folder
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files from the backend folder to the container's /app
COPY backend/ .

# Expose port (Hugging Face Spaces standard is 7860)
ENV PORT=7860
EXPOSE 7860

# Run the app
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--threads", "2", "--timeout", "120", "app:app"]
