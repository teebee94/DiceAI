# 📝 Quick Setup Instructions

## To build your APK, follow these steps:

### 1. Push to GitHub

```powershell
cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI"

# Initialize git (if not already done)
git init
git add .
git commit -m "DiceAI Android App - Ready to build"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/DiceAI.git
git branch -M main
git push -u origin main
```

**When prompted for password**, use your personal access token (provided separately)

### 2. Get Your APK

After pushing:

1. Go to https://github.com/YOUR-USERNAME/DiceAI
2. Click the **"Actions"** tab
3. Wait 2-5 minutes for the build to complete
4. Click on the completed workflow run
5. Download **app-debug.apk** from artifacts

**OR** check **Releases** page for the auto-created release!

### 3. Install on Phone

1. Transfer APK to your Android phone
2. Enable "Install from Unknown Sources" in Settings
3. Open and install the APK
4. Enjoy! 🎲

---

For full details, see **INSTALLATION-GUIDE.md**
