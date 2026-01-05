# DiceAI Android App

[![Android Build](https://github.com/YOUR-USERNAME/DiceAI/actions/workflows/android-build.yml/badge.svg)](https://github.com/YOUR-USERNAME/DiceAI/actions/workflows/android-build.yml)

🎲 **AI-Powered Dice Prediction System** for Android

An intelligent Android application that uses pattern recognition and machine learning to predict dice game outcomes. Features a self-learning algorithm that improves over time based on user feedback.

---

## ✨ Features

- 🔮 **AI Predictions**: Advanced pattern recognition algorithms
- 📊 **Statistics Dashboard**: Real-time accuracy tracking and analytics
- 📷 **Image Analysis**: OCR-powered bulk data entry from screenshots
- 🧠 **Self-Learning**: Algorithm adapts based on your feedback
- 💾 **Data Persistence**: All data stored locally
- 📤 **Import/Export**: Backup and restore your prediction history
- 🏆 **Competitive Mode**: Adjustable confidence thresholds for better accuracy
- 🎯 **Multiple Game Types**: Support for 1min, 3min, 5min, and 10min games

---

## 📱 Installation

### Quick Start

1. **Download the APK**:
   - Go to [Releases](https://github.com/YOUR-USERNAME/DiceAI/releases)
   - Download the latest `app-debug.apk`

2. **Install on Android**:
   - Enable "Install from Unknown Sources" in Settings
   - Open the APK file and follow installation prompts

**For detailed instructions, see [INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md)**

---

## 🏗️ Building from Source

### Prerequisites

- Java JDK 17 or higher
- Android SDK (API 33)
- Gradle 7.4+

### Build Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/DiceAI.git
   cd DiceAI
   ```

2. Set Android SDK path in `local.properties`:
   ```properties
   sdk.dir=/path/to/android/sdk
   ```

3. Build the APK:
   ```bash
   ./gradlew assembleDebug
   ```

4. Find the APK at:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 🚀 Automated Builds

This repository uses **GitHub Actions** to automatically build APKs on every push to the main branch.

The workflow:
- ✅ Builds debug APK
- ✅ Builds release APK (unsigned)
- ✅ Uploads artifacts
- ✅ Creates GitHub releases automatically

### Workflow Status

Check the [Actions tab](https://github.com/YOUR-USERNAME/DiceAI/actions) to see build status and download artifacts.

---

## 🎮 How It Works

The app uses a WebView to load a sophisticated web application that includes:

1. **Pattern Recognition Engine**: Analyzes historical dice patterns
2. **Multiple Prediction Algorithms**: Frequency analysis, pattern matching, Markov chains, and more
3. **Adaptive Learning**: Weights successful prediction methods higher
4. **Statistical Analysis**: Tracks hot/cold numbers, streaks, and trends

All processing happens entirely on-device with no external API calls required.

---

## 📁 Project Structure

```
DiceAI/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/diceai/
│   │       │   └── MainActivity.java    # Main activity (WebView)
│   │       ├── res/
│   │       │   ├── mipmap-*/            # Launcher icons
│   │       │   └── values/              # Strings and resources
│   │       ├── assets/                  # Web app files
│   │       │   ├── index.html
│   │       │   ├── index.css
│   │       │   ├── app.js
│   │       │   ├── prediction-engine.js
│   │       │   ├── learning-engine.js
│   │       │   ├── image-analyzer.js
│   │       │   └── period-parser.js
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── .github/
│   └── workflows/
│       └── android-build.yml            # CI/CD workflow
├── gradle/
├── build.gradle
├── settings.gradle
├── INSTALLATION-GUIDE.md
└── README.md
```

---

## 🔧 Configuration

### Permissions

The app requires the following permissions:
- **INTERNET**: For loading external libraries (Tesseract.js CDN)
- **CAMERA**: For image capture functionality
- **READ_EXTERNAL_STORAGE**: For uploading screenshots
- **WRITE_EXTERNAL_STORAGE**: For saving exported data

### Supported Android Versions

- **Minimum SDK**: Android 6.0 (API 23)
- **Target SDK**: Android 13 (API 33)
- **Recommended**: Android 8.0+ for best performance

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is provided as-is for personal use.

---

## 🐛 Known Issues

- OCR requires internet connection for first-time Tesseract.js loading
- Release APK is unsigned (requires manual signing for Play Store distribution)

---

## 🔮 Future Enhancements

- [ ] Offline OCR (bundle Tesseract.js locally)
- [ ] Cloud backup sync
- [ ] Dark mode toggle
- [ ] Multiple language support
- [ ] Advanced charting and visualization

---

## 📞 Support

Having issues? Check the [INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md) troubleshooting section or create an issue in the repository.

---

**Made with ❤️ for dice game enthusiasts**
