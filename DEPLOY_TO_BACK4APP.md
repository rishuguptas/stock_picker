# Deploying to Back4App (Free Tier)

Back4App Containers is a great choice for hosting the Python backend because it allows outbound connections (needed for NSE data) and has a free tier.

## Prerequisites
1.  Push your latest code to GitHub.

## Step 1: Deploy Backend (Back4App)

1.  **Sign Up/Login**: Go to [Back4App Containers](https://www.back4app.com/containers) and log in.
2.  **New App**: Click **"New App"** (or "Build a New App").
3.  **Source**: Select **"GitHub Container"**.
    *   Connect your GitHub account if prompted.
    *   Select your `stock_picker` repository.
4.  **Configure**:
    *   **App Name**: `bharat-cap-backend` (or similar).
    *   **Branch**: `main` (or whatever branch you use).
    *   **Root Directory**: `backend` (IMPORTANT: Tell it to look in the backend folder!).
    *   **Auto-Deploy**: Yes.
5.  **Environment Variables**:
    *   Add `FLASK_ENV` = `production`
    *   Add `CACHE_TIMEOUT` = `300`
6.  **Deploy**: Click **"Create App"**.

Back4App will read the `Dockerfile` we just created, build the image, and start it.
Once done, it will give you a URL like `https://bharat-cap-backend.b4a.run`.

## Step 2: Deploy Frontend (Vercel)

Since Back4App Containers is for the backend, use **Vercel** for the React Frontend (it's the best combo).

1.  Go to [Vercel](https://vercel.com) and "Add New Project".
2.  Import your `stock_picker` repo.
3.  **Root Directory**: Select `frontend`.
4.  **Build Settings**: reliable defaults (Vite).
5.  **Environment Variables**:
    *   **Name**: `VITE_API_URL`
    *   **Value**: Your Back4App URL + `/api` (e.g., `https://bharat-cap-backend.b4a.run/api`)
6.  **Deploy**.

## Troubleshooting Back4App Memory
The free tier gives **256 MB RAM**.
*   We configured `gunicorn` to use only **1 Worker** to save RAM.
*   If the app crashes with "OOM" (Out of Memory) or "Exit Code 137", it means fetching 3000 stocks used too much RAM.
*   **Fix**: If this happens, we might need to optimize the Python code to process data in chunks (generators) instead of loading one big Pandas DataFrame. But try it first!
