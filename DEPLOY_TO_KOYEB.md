# Deploying to Koyeb (Free Tier)

Koyeb is a powerful alternative to Back4App. It gives you **512 MB RAM** (twice as much as Back4App), which is much safer for our Pandas-based stock processing.

## Step 1: Deploy Backend (Koyeb)

1.  **Sign Up**: Go to [Koyeb.com](https://www.koyeb.com) and create a free account.
2.  **Create App**: Click **"Create App"**.
3.  **Deployment Method**: Choose **"GitHub"**.
    *   Connect your GitHub account.
    *   Select your `stock_picker` repo.
    *   **IMPORTANT**: In the configuration settings, look for **"Work Directory"** or **"Root Directory"** and make sure it is set to `/` (default) since our `Dockerfile` is in the root.
4.  **Service Configuration**:
    *   Koyeb will automatically detect the `Dockerfile`.
    *   **Exposed Port**: Set to `8080` (matches our Dockerfile).
5.  **Environment Variables**:
    *   Add `FLASK_ENV` = `production`
    *   Add `CACHE_TIMEOUT` = `300`
6.  **Deploy**: Click **"Deploy"**.

Koyeb will build your image and give you a public URL (e.g., `https://stock-picker-rishuguptas.koyeb.app`).

## Step 2: Update Frontend (Vercel)

1.  Go to your Vercel Dashboard for the `stock_picker` frontend.
2.  Update the `VITE_API_URL` environment variable to your new Koyeb URL + `/api`.
    *   Example: `https://stock-picker-rishuguptas.koyeb.app/api`
3.  Redeploy the Frontend.

---

### Why Koyeb?
*   **Memory**: 512MB is plenty for our 3000-stock merge.
*   **Uptime**: Its free tier lasts longer before "sleeping" than Render.
*   **Outbound**: It allows direct connections to NSE.
