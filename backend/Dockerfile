# Base image - Slim version for lower memory usage (Crucial for B4A Free Tier)
FROM python:3.10-slim

# Install system dependencies required for building Python packages and git
# git is needed because nselib is installed from github
RUN apt-get update && apt-get install -y \
    git \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
# --no-cache-dir reduces image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port (Back4App expects 8080 usually, or defined by PORT env var)
ENV PORT=8080
EXPOSE 8080

# Command to run the application using Gunicorn (Production Server)
# app:app refers to 'app.py' file and 'app' Flask instance
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "2", "--timeout", "120", "app:app"]
