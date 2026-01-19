# How to Launch on Android 🚀

To get the app working on your phone as a real app, we need to put it online (Hosting). The easiest and free way is **GitHub Pages**.

## Phase 1: Go Online (Computer)

### 1. Create a Repository
1.  Log in to [GitHub.com](https://github.com/new).
2.  Repository name: `dice-ai-app`
3.  Public/Private: **Public** (required for free hosting).
4.  Click **Create repository**.

### 2. Push Your Code
Copy and paste these commands into your terminal one by one:

```powershell
# 1. Initialize Git
git init
git add .
git commit -m "Deploy to Android"

# 2. Link to GitHub (REPLACE LINK below with your actual repo link!)
git remote add origin https://github.com/YOUR_USERNAME/dice-ai-app.git

# 3. Upload
git branch -M main
git push -u origin main
```

### 3. Turn on the Website
1.  Go to your new repository on GitHub.
2.  Click **Settings** (top tab) -> **Pages** (left menu).
3.  Under "Source", change `None` to **`main`**.
4.  Click **Save**.
5.  Wait 1 minute. Refresh the page until you see a link like: `https://yourname.github.io/dice-ai-app/`

---

## Phase 2: Install on Android (Phone)

### 1. Open in Chrome
1.  Send that link to your phone (email/WhatsApp it to yourself).
2.  Open it in **Google Chrome**.

### 2. Add to Home Screen
1.  Tap the **3 dots** (menu) in the top right.
2.  Tap **"Add to Home Screen"** or **"Install DiceAI"**.
3.  Tap **Install**.

### 3. Use it!
*   The app will now appear on your home screen like a native Android app.
*   It works fullscreen (no browser bar).
*   It works offline.

---

## Troubleshooting
*   **"Site not found 404":** Wait 2 more minutes and refresh. It takes time to build.
*   **"Install" button missing:** Reload the page once. Make sure you are using Chrome.
