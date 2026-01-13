# Simple HTTP Server for DiceAI

## Option 1: Python Server (Easiest)

### For Python 3:
```bash
cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI-Web"
python -m http.server 8080
```

### For Python 2:
```bash
cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI-Web"
python -m SimpleHTTPServer 8080
```

Then access at: `http://localhost:8080`  
From other devices on same network: `http://YOUR_LOCAL_IP:8080`

---

## Option 2: Node.js Server

### Install http-server globally:
```bash
npm install -g http-server
```

### Run server:
```bash
cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI-Web"
http-server -p 8080
```

Then access at: `http://localhost:8080`

---

## Option 3: PowerShell One-Liner (Windows)

### Create and run simple server:
```powershell
cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI-Web"
python -m http.server 8080
```

---

## Finding Your Local IP

### Windows:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)

### Access from other devices:
Once you know your IP (e.g., 192.168.1.100):
- http://192.168.1.100:8080

---

## GitHub Pages Deployment (Public Access)

### 1. Create GitHub Repository
```bash
cd "c:\Users\vansh\OneDrive\Desktop\New folder (2)\DiceAI-Web"
git init
git add .
git commit -m "Initial DiceAI web app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DiceAI.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Select "main" branch as source
4. Save

Your app will be live at: `https://YOUR_USERNAME.github.io/DiceAI/`

---

## Security Notes

- **Local Network Only**: Python/Node servers are for local network access only
- **No Authentication**: Anyone on your network can access it
- **Data Privacy**: All data stays in browser (localStorage) on each device
- **GitHub Pages**: Public by default unless you have a private repo with GitHub Pro

---

## Recommended Setup

For quick local testing: **Python server** (simplest)  
For permanent access: **GitHub Pages** (free hosting)  
For team access: **Local server** on network  

Choose based on your needs!
