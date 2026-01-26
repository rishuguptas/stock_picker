# Deploying to Hugging Face Spaces (No Credit Card Required)

Hugging Face Spaces is the best free alternative. It gives you **16 GB RAM** (huge!) and does **not** require a credit card.

## Step 1: Create a Hugging Face Space

1.  **Sign Up**: Go to [HuggingFace.co](https://huggingface.co/join) and create a free account.
2.  **New Space**: Click your profile picture (top right) -> **"New Space"**.
3.  **Configure**:
    *   **Space Name**: `bharat-cap-api` (or similar).
    *   **License**: `apache-2.0` (or leave default).
    *   **SDK**: Select **"Docker"**.
    *   **Template**: Select **"Blank"**.
    *   **Hardware**: Select **"CPU basic - 2 vCPU - 16 GB - FREE"**.
4.  **Create Space**: Click **"Create Space"**.

## Step 2: Push your code to the Space

There are two ways to do this. The easiest is using their website:

1.  In your new Space, go to the **"Files"** tab.
2.  Click **"Add File" -> "Upload Files"**.
3.  Upload **only these files**:
    *   `Dockerfile` (from the root directory)
    *   `backend/` (upload the entire folder)
    *   `existing_app/` (optional, not needed for API)
4.  **Commit changes** (bottom of the page).

Hugging Face will automatically see your `Dockerfile`, build the image, and start the app.
Once done, it will say **"Running"**.

## Step 3: Get your API URL

1.  Your API URL will be: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`
2.  **Wait**: Flask inside the space usually runs on port **7860** by default (Hugging Face standard).

## Step 4: Update Dockerfile (Crucial for HF Spaces)

Hugging Face expects the app on port **7860**. I am updating your Dockerfile to handle this.

1.  I have updated your local `Dockerfile`.
2.  Please push the update to GitHub, or upload the new version to Hugging Face.

## Step 5: Update Frontend (Vercel)

1.  Go to your Vercel Dashboard for the `stock_picker` frontend.
2.  Update the `VITE_API_URL` environment variable to your new Hugging Face URL + `/api`.
    *   Example: `https://rishuguptas-bharat-cap-api.hf.space/api`
3.  Redeploy the Frontend.
