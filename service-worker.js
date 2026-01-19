const CACHE_NAME = 'diceai-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './data-manager.js',
    './ai-chat-assistant.js',
    './analytics-engine.js',
    './chart-visualizer.js',
    './prediction-tracker.js',
    './advanced-predictor.js',
    './notification-manager.js',
    './automation-engine.js',
    './voice-commands.js',
    './data-exporter.js',
    './firebase-config.js',
    './firebase-sync.js',
    './period-parser.js',
    './prediction-engine.js',
    './learning-engine.js',
    './image-analyzer.js',
    './ai-insights.js',
    './theme-manager.js',
    './advanced-ai.js',
    './keyboard-shortcuts.js',
    'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
