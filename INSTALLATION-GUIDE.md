# 🎲 DiceAI Android App - Setup & Installation Guide

## 📋 Overview

DiceAI is an Android application that provides AI-powered dice prediction using pattern recognition and machine learning. The app is built using a WebView to load a fully-featured web application with all prediction logic running client-side.

---

## 🚀 Building the APK

You have **two options** to get the APK:

### Option 1: GitHub Actions (Recommended ✅)

The easiest way is to use the automated GitHub Actions workflow:

1. **Initialize Git Repository** (if not already done):
   ```powershell
   cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI"
   git init
   git add .
   git commit -m "Initial commit: DiceAI Android App"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "DiceAI")
   - Don't initialize with README (you already have files)

3. **Push to GitHub**:
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/DiceAI.git
   git branch -M main
   git push -u origin main
   ```
   
   When prompted for credentials:
   - Username: Your GitHub username
   - Password: Use your personal access token (provided separately)

4. **Download the APK**:
   - The GitHub Action will automatically build the app
   - Go to your repository's "Actions" tab
   - Wait for the build to complete (2-5 minutes)
   - Click on the completed workflow run
   - Download **app-debug.apk** from the artifacts
   
   **OR** check the "Releases" page:
   - Navigate to the "Releases" section
   - Download the latest release APK

### Option 2: Local Build (Requires Android SDK)

If you have Android SDK installed locally:

1. **Set Android SDK Path**:
   Create a file `local.properties` in the DiceAI folder:
   ```properties
   sdk.dir=C\:\\Users\\YOUR-USERNAME\\AppData\\Local\\Android\\Sdk
   ```
   (Replace with your actual Android SDK path)

2. **Build with Gradle**:
   ```powershell
   cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI"
   .\gradlew.bat assembleDebug
   ```

3. **Find the APK**:
   The APK will be located at:
   ```
   app\build\outputs\apk\debug\app-debug.apk
   ```

---

## 📱 Installing on Android Device

### Step 1: Enable Unknown Sources

1. Open **Settings** on your Android device
2. Go to **Security** (or **Security & Privacy**)
3. Enable **Unknown Sources** or **Install Unknown Apps**
   - On Android 8.0+: Allow your file manager to install apps

### Step 2: Transfer the APK

Choose one method:

**Via USB Cable:**
1. Connect your device to your computer
2. Copy `app-debug.apk` to your device's Downloads folder
3. Safely disconnect

**Via Cloud/Email:**
1. Upload APK to Google Drive, Dropbox, or email it to yourself
2. Download on your Android device

**Direct Download:**
1. If using GitHub Releases, open the release URL on your phone's browser
2. Download the APK directly

### Step 3: Install

1. Open your **File Manager** or **Downloads** app on Android
2. Find `app-debug.apk`
3. Tap on it
4. Follow the installation prompts
5. Tap **Install**
6. Wait for installation to complete
7. Tap **Open** to launch the app

---

## 🎮 Using the App

Once installed, the DiceAI app includes:

- **AI Predictions**: Generate predictions based on historical patterns
- **Manual Entry**: Input dice results manually
- **Image Analysis**: Upload screenshots for bulk data entry (uses OCR)
- **Statistics Dashboard**: Track accuracy and patterns
- **Learning Engine**: Self-improving algorithm based on feedback
- **History**: View all past predictions and results
- **Import/Export**: Backup and restore your data

The app stores all data locally using WebView's localStorage, so your data persists between sessions.

---

## 🔧 Troubleshooting

### ❌ "App not installed" error
- **Cause**: Conflicting package signatures
- **Solution**: Uninstall any previous version of DiceAI before installing

### ❌ "Installation blocked" message
- **Cause**: Unknown sources not enabled
- **Solution**: Enable installation from unknown sources for your file manager/browser

### ❌ App crashes on startup
- **Cause**: WebView not available (rare on modern Android)
- **Solution**: Update Android System WebView from Google Play Store

### ❌ Cannot upload images
- **Cause**: Storage permissions not granted
- **Solution**: Go to Settings → Apps → DiceAI → Permissions → Enable Storage

---

## 🆕 Updating the App

To update to a new version:

1. Download the new APK
2. Simply install it over the existing app (no need to uninstall)
3. Your data will be preserved

---

## 📦 What's Included

The app package contains:
- **Main App**: WebView-based Android application
- **Web Assets**: HTML, CSS, and JavaScript files for the UI and logic
- **AI Engine**: Pattern recognition and prediction algorithms
- **OCR Support**: Tesseract.js for image analysis
- **Launcher Icon**: Custom dice-themed app icon

---

## 🔐 Privacy & Security

- **All data stays local**: No data is sent to external servers
- **No internet required**: App works completely offline (except for CDN-loaded Tesseract.js)
- **localStorage**: All predictions and history stored in WebView's local storage

---

## 💡 Tips

1. **Feed it data**: The more historical data you provide, the better predictions become
2. **Use feedback**: Always mark predictions as correct/wrong to help the AI learn
3. **Competitive mode**: Enable for higher accuracy threshold (skips low-confidence predictions)
4. **Export regularly**: Backup your data using the Export button in the History section

---

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Try uninstalling and reinstalling the app
3. Clear app data: Settings → Apps → DiceAI → Storage → Clear Data

---

**Enjoy using DiceAI! 🎲🤖**
