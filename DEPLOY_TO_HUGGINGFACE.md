# Deploying POC to Hugging Face Spaces (All-in-One)

Since this is a POC, we have merged the Frontend and Backend into a single deployment. You just need to upload everything to Hugging Face.

## Step 1: Create a Hugging Face Space

1.  Go to [HuggingFace.co](https://huggingface.co/spaces) and log in.
2.  **New Space**: Click **"New Space"**.
3.  **Space Name**: `bharat-cap` (or any name).
4.  **SDK**: Select **"Docker"**.
5.  **Template**: Select **"Blank"**.
6.  **Hardware**: Select **"CPU basic - 2 vCPU - 16 GB - FREE"**.
7.  **Create Space**.

## Step 2: Push your code (The "One-Shot" Way)

The easiest and fastest way to upload folders is to **link your GitHub repository**.

1.  In your new Space, look for the **"Settings"** tab.
2.  Scroll down to **"Repository Settings"**.
3.  Click **"Manage connected repository"** or **"Link a GitHub repository"**.
4.  Select your `rishuguptas/stock_picker` repo.
5.  **Done!** Hugging Face will instantly pull all your folders (`frontend/`, `backend/`, etc.) and start building.

### Alternative: If you don't want to link GitHub
Hugging Face Spaces are actually Git repositories themselves. You can push to them just like GitHub:
1.  Copy the Space's Git URL (it looks like `https://huggingface.co/spaces/YOUR_NAME/YOUR_SPACE`).
2.  In your terminal:
    ```bash
    git remote add hf https://huggingface.co/spaces/YOUR_NAME/YOUR_SPACE
    git push hf main --force
    ```

## Step 3: View your App

Once the status says **"Running"**, just click the **"See App"** button or visit:
`https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`

---

### Managing Changes
Every time you push a change to your GitHub repo (if you linked it) or upload a new file, Hugging Face will automatically rebuild your site.

**No more Vercel needed!** Everything is now in this one URL.
