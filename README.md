# 🎲 DiceAI - Professional AI-Powered Dice Prediction System

> **Advanced pattern recognition and self-learning prediction engine for dice games**

[![Version](https://img.shields.io/badge/version-1.0.15-blue.svg)](https://github.com/teebee94/DiceAI/releases)
[![Platform](https://img.shields.io/badge/platform-Android-green.svg)](https://github.com/teebee94/DiceAI/releases)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

---

## ✨ Features

### 🎨 **Modern UI & Themes**
- **4 Beautiful Themes**: Dark 🌙, Ocean 🌊, Sunset 🌅, Forest 🌲
- **Glassmorphism Design**: Frosted glass effects throughout
- **Smooth Animations**: 60 FPS transitions and micro-interactions
- **Gradient Backgrounds**: Dynamic, vibrant color schemes

### 🤖 **Advanced AI Engine**
- **14 Prediction Algorithms**: Frequency, hot/cold, Markov chains, Bayesian, and more
- **Confidence Scoring**: Real-time prediction confidence (0-100%)
- **Pattern Detection**: Identifies sequences, cycles, and trends
- **Time-Based Analysis**: Hour/period-specific pattern recognition
- **Adaptive Learning**: Self-improves based on historical data

### 📊 **Analytics Dashboard**
- **Win/Loss Charts**: Visualize performance over last 30 games
- **Frequency Analysis**: Bar charts showing number distribution
- **Streak Tracker**: Monitor hot streaks with fire indicator 🔥
- **Real-time Statistics**: Live updates as you add data

### 🏆 **Gamification System**
- **8 Achievements**: First Blood, Hat Trick, On Fire, Unstoppable, and more
- **Level Progression**: Earn XP and level up (Level 1-50+)
- **Confetti Celebrations**: Visual rewards for achievements 🎊
- **Progress Tracking**: XP bar and milestone notifications

### 🧠 **Smart Features**
- **Undo/Redo**: Full history with Ctrl+Z/Y support (10 actions)
- **Smart Suggestions**: AI-powered tips based on your play patterns
- **Copy to Clipboard**: One-click sharing of predictions
- **Keyboard Shortcuts**: Power user friendly

### 📱 **Mobile Optimized**
- **Haptic Feedback**: Vibration on Android for all interactions
- **Toast Notifications**: Sleek slide-in notifications
- **Loading Animations**: Professional 3-ring spinner
- **Touch Optimized**: Large tap targets for mobile
- **Responsive Design**: Works on all screen sizes

### 📸 **Image Analysis**
- **Gallery Integration**: Select multiple screenshots at once
- **Auto-Focus**: Instant focus on input fields
- **Enter Key Support**: Quick data entry
- **Beautiful UI**: Gradient upload zone with animations
- **Progress Tracking**: "Screenshot X of Y" counter

---

## 📥 Download

### **Latest Release: v1.0.15**

**[📱 Download APK (5.37 MB)](https://github.com/teebee94/DiceAI/releases/download/v1.0.15/app-debug.apk)**

**What's New in v1.0.15:**
- ✨ 4 gorgeous themes with glassmorphism
- 📊 Interactive analytics dashboard with 3 chart types
- 🏆 Complete gamification system (8 achievements + levels)
- 🧠 Smart features (undo/redo, suggestions, clipboard)
- 💎 Professional UI polish with all animations
- 📱 Enhanced mobile experience with haptic feedback

---

## 🚀 Quick Start

### Installation
1. **Download** the APK from [releases](https://github.com/teebee94/DiceAI/releases)
2. **Enable** "Install from Unknown Sources" on your Android device
3. **Install** and open the app
4. **Grant** photo permissions when prompted

### First Use
1. **Select Photos** → Tap the "📸 Open Gallery" button
2. **Add Data** → Enter sum values for each screenshot
3. **Get Predictions** → AI analyzes patterns and predicts next number
4. **Track Progress** → View charts, unlock achievements, level up!

---

## 🎯 How It Works

### Prediction Engine
DiceAI uses **14 advanced algorithms** working together:

1. **Frequency Analysis** - Identifies most common numbers
2. **Hot/Cold Detection** - Tracks trending patterns
3. **Trend Analysis** - Detects directional movements
4. **Sequence Recognition** - Finds repeating patterns
5. **Cycle Detection** - Identifies periodic behavior
6. **Big/Small Momentum** - Tracks range patterns
7. **Even/Odd Patterns** - Analyzes parity trends
8. **Gap Analysis** - Predicts based on appearance gaps
9. **Time-of-Day Patterns** - Hour-specific learning
10. **Hourly Patterns** - Precise time analysis
11. **Time Window Analysis** - ±15 minute patterns
12. **Markov Chains** - Transition probabilities
13. **Bayesian Engine** - Probabilistic inference
14. **Multi-Level Recognition** - Complex pattern detection

### Learning System
- **Dynamic Weights**: Algorithms adjust based on accuracy
- **Historical Analysis**: Learns from your entire dataset
- **Real-time Updates**: Improves with each new entry
- **Confidence Scoring**: Shows prediction reliability

---

## 📊 Screenshots

### Main Interface
*Beautiful gradient UI with glassmorphism design*

### Analytics Dashboard
*Real-time charts showing win/loss trends and frequency*

### Gamification
*Achievement unlocks with confetti celebration*

### Theme Variants
*4 distinct themes: Dark, Ocean, Sunset, Forest*

---

## 🏆 Achievements

Unlock these achievements as you use the app:

| Achievement | Icon | Description |
|------------|------|-------------|
| **First Blood** | 🎯 | Get your first correct prediction |
| **Hat Trick** | 🎩 | 3 correct predictions in a row |
| **On Fire** | 🔥 | 5 correct predictions in a row |
| **Unstoppable** | ⚡ | 10 correct predictions in a row |
| **Century** | 💯 | Make 100 predictions |
| **Veteran** | 🏆 | Make 500 predictions |
| **Sharp Shooter** | 🎲 | Reach 70% accuracy |
| **Master Predictor** | 👑 | Reach 90% accuracy |

---

## 💻 Technical Details

### Architecture
- **Frontend**: Pure JavaScript with modular components
- **UI**: Glassmorphism with CSS animations
- **Storage**: LocalStorage for data persistence
- **Analytics**: Custom mini-chart system
- **Gamification**: Event-driven achievement engine

### Components
```
├── ui-components.js      # Themes, toasts, spinner, confidence display
├── features.js           # Analytics dashboard, gamification
├── smart-features.js     # Undo/redo, suggestions, clipboard
├── prediction-engine.js  # 14 AI algorithms
├── learning-engine.js    # Adaptive learning system
├── image-analyzer.js     # OCR and image processing
└── app.js               # Main application logic
```

### Performance
- **60 FPS Animations**: Hardware-accelerated CSS
- **Lazy Loading**: Components load on demand
- **Efficient Storage**: Optimized data structures
- **Fast Rendering**: Minimal DOM manipulation

---

## 🎨 Customization

### Available Themes
```javascript
// Switch themes programmatically
window.themeManager.applyTheme('ocean');   // Ocean theme
window.themeManager.applyTheme('sunset');  // Sunset theme
window.themeManager.applyTheme('forest');  // Forest theme
window.themeManager.applyTheme('dark');    // Dark theme (default)
```

### Keyboard Shortcuts
- `Ctrl+Z` - Undo last action
- `Ctrl+Y` - Redo action
- `Ctrl+Shift+Z` - Redo (alternative)

---

## 📈 Version History

### v1.0.15 (Latest)
- ✨ Added 4 theme system with glassmorphism
- 📊 Implemented analytics dashboard (3 chart types)
- 🏆 Complete gamification (8 achievements + levels)
- 🧠 Smart features (undo/redo + suggestions)
- 💎 Professional UX polish

### v1.0.14
- 🎨 Modern UI components package
- ⏳ Animated loading spinner
- 🔔 Toast notification system
- 📱 Haptic feedback for Android
- 📊 Confidence display ring

### v1.0.13
- 🎨 Enhanced Android upload UI/UX
- ✨ Beautiful gradients and animations
- ⚡ Auto-focus and Enter key support
- 🎉 Success toast notifications
- 📱 Mobile-optimized layout

### v1.0.12
- ✅ Fixed permission "Allow" button
- 🔧 Added permission callback handling
- 🎨 Improved image upload interface

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

### Feature Requests
Open an issue describing:
- The feature you'd like
- Why it would be useful
- Any implementation ideas

---

## 📄 License

MIT License - Feel free to use and modify for personal use.

---

## 🙏 Acknowledgments

Built with:
- Pure JavaScript (no frameworks)
- CSS3 for animations and glassmorphism
- LocalStorage for data persistence
- Advanced statistical algorithms

---

## 📞 Support

Having issues? Check:
1. **Permissions**: Ensure photo access is granted
2. **Installation**: Enable "Unknown Sources"
3. **Compatibility**: Requires Android 6.0+

---

## 🌟 Star This Repo

If you find DiceAI useful, give it a ⭐!

---

**Made with ❤️ for dice game enthusiasts**

*Last Updated: January 2026*
