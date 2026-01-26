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

## Step 2: Push your code

Since we merged the apps, you need to upload **all** your project files.

1.  In your Space, go to the **"Files"** tab.
2.  Click **"Add File" -> "Upload Files"**.
3.  Upload **Everything** (folders: `backend/`, `frontend/`, files: `Dockerfile`, `.gitignore`).
4.  **Wait**: Hugging Face will take 2-4 minutes to build the project. It is:
    *   Installing Node.js & Building the React app.
    *   Installing Python & Starting the Flask server.

## Step 3: View your App

Once the status says **"Running"**, just click the **"See App"** button or visit:
`https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`

---

### Managing Changes
Every time you push a change to your GitHub repo (if you linked it) or upload a new file, Hugging Face will automatically rebuild your site.

**No more Vercel needed!** Everything is now in this one URL.
