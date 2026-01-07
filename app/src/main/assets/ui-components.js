// Theme Manager - Handle multiple color themes
class ThemeManager {
    constructor() {
        this.themes = {
            dark: {
                name: 'Dark Mode',
                emoji: '🌙',
                colors: {
                    '--color-bg-primary': '#0f0f1e',
                    '--color-bg-secondary': '#1a1a2e',
                    '--color-bg-tertiary': '#252538',
                    '--color-bg-card': 'rgba(37, 37, 56, 0.6)',
                    '--color-text-primary': '#f8fafc',
                    '--color-text-secondary': '#cbd5e1'
                }
            },
            ocean: {
                name: 'Ocean',
                emoji: '🌊',
                colors: {
                    '--color-bg-primary': '#0a192f',
                    '--color-bg-secondary': '#112240',
                    '--color-bg-tertiary': '#172a45',
                    '--color-bg-card': 'rgba(23, 42, 69, 0.6)',
                    '--color-primary': '#64ffda',
                    '--color-secondary': '#00d4ff',
                    '--color-text-primary': '#ccd6f6',
                    '--color-text-secondary': '# a8b2d1'
                }
            },
            sunset: {
                name: 'Sunset',
                emoji: '🌅',
                colors: {
                    '--color-bg-primary': '#1a0f2e',
                    '--color-bg-secondary': '#2d1b3d',
                    '--color-bg-tertiary': '#3d2551',
                    '--color-bg-card': 'rgba(61, 37, 81, 0.6)',
                    '--color-primary': '#ff6b9d',
                    '--color-secondary': '#ffa06b',
                    '--color-text-primary': '#fce7f3',
                    '--color-text-secondary': '#f9a8d4'
                }
            },
            forest: {
                name: 'Forest',
                emoji: '🌲',
                colors: {
                    '--color-bg-primary': '#0d1b0e',
                    '--color-bg-secondary': '#162d19',
                    '--color-bg-tertiary': '#1f3d22',
                    '--color-bg-card': 'rgba(31, 61, 34, 0.6)',
                    '--color-primary': '#52d273',
                    '--color-secondary': '#88e5a0',
                    '--color-text-primary': '#e6f7e9',
                    '--color-text-secondary': '#b8e6c1'
                }
            }
        };

        this.currentTheme = 'dark';
        this.loadTheme();
    }

    loadTheme() {
        const saved = localStorage.getItem('diceai_theme');
        if (saved && this.themes[saved]) {
            this.applyTheme(saved);
        }
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) return;

        const theme = this.themes[themeName];
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        this.currentTheme = themeName;
        localStorage.setItem('diceai_theme', themeName);

        // Show toast
        this.showToast(`Theme changed to ${theme.emoji} ${theme.name}`);
    }

    showToast(message) {
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, 'info');
        }
    }

    getThemeList() {
        return Object.entries(this.themes).map(([id, theme]) => ({
            id,
            name: theme.name,
            emoji: theme.emoji,
            active: id === this.currentTheme
        }));
    }
}

// Loading Spinner Component
class LoadingSpinner {
    constructor() {
        this.spinner = null;
        this.createSpinner();
    }

    createSpinner() {
        this.spinner = document.createElement('div');
        this.spinner.className = 'loading-spinner-overlay';
        this.spinner.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-text">Processing...</div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 15, 30, 0.9);
                backdrop-filter: blur(10px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .loading-spinner-overlay.active {
                display: flex;
            }
            
            .loading-spinner {
                position: relative;
                width: 120px;
                height: 120px;
            }
            
            .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 4px solid transparent;
                border-top-color: var(--color-primary);
                border-radius: 50%;
                animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
            }
            
            .spinner-ring:nth-child(2) {
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                border-top-color: var(--color-secondary);
                animation-delay: -0.5s;
            }
            
            .spinner-ring:nth-child(3) {
                width: 60%;
                height: 60%;
                top: 20%;
                left: 20%;
                border-top-color: var(--color-success);
                animation-delay: -1s;
            }
            
            .spinner-text {
                position: absolute;
                top: 140px;
                left: 50%;
                transform: translateX(-50%);
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
                font-weight: 600;
                white-space: nowrap;
                animation: pulse 1.5s ease infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.spinner);
    }

    show(text = 'Processing...') {
        if (this.spinner) {
            const textElement = this.spinner.querySelector('.spinner-text');
            if (textElement) textElement.textContent = text;
            this.spinner.classList.add('active');
        }
    }

    hide() {
        if (this.spinner) {
            this.spinner.classList.remove('active');
        }
    }
}

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';

        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
                pointer-events: none;
            }
            
            .toast {
                background: var(--color-bg-card);
                backdrop-filter: blur(20px);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                padding: var(--space-md) var(--space-lg);
                min-width: 300px;
                max-width: 500px;
                box-shadow: var(--shadow-xl);
                display: flex;
                align-items: center;
                gap: var(--space-md);
                pointer-events: auto;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            }
            
            .toast-icon {
                font-size: var(--font-size-xl);
                flex-shrink: 0;
            }
            
            .toast-content {
                flex: 1;
            }
            
            .toast-message {
                color: var(--color-text-primary);
                font-weight: 600;
                margin-bottom: 2px;
            }
            
            .toast-time {
                color: var(--color-text-tertiary);
                font-size: var(--font-size-xs);
            }
            
            .toast-close {
                background: none;
                border: none;
                color: var(--color-text-tertiary);
                cursor: pointer;
                padding: var(--space-xs);
                border-radius: var(--radius-sm);
                font-size: var(--font-size-lg);
                line-height: 1;
                transition: all var(--transition-fast);
            }
            
            .toast-close:hover {
                background: var(--color-bg-hover);
                color: var(--color-text-primary);
            }
            
            .toast.success { border-color: var(--color-success); }
            .toast.error { border-color: var(--color-error); }
            .toast.warning { border-color: var(--color-warning); }
            .toast.info { border-color: var(--color-primary); }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
                <div class="toast-time">${new Date().toLocaleTimeString()}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
}

// Haptic Feedback (Android)
class HapticFeedback {
    constructor() {
        this.enabled = 'vibrate' in navigator;
    }

    light() {
        if (this.enabled) navigator.vibrate(10);
    }

    medium() {
        if (this.enabled) navigator.vibrate(20);
    }

    heavy() {
        if (this.enabled) navigator.vibrate([30, 10, 30]);
    }

    success() {
        if (this.enabled) navigator.vibrate([10, 50, 10]);
    }

    error() {
        if (this.enabled) navigator.vibrate([50, 30, 50, 30, 50]);
    }
}

// Confidence Display Component
class ConfidenceDisplay {
    constructor() {
        this.createStyles();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .confidence-display {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-lg);
                margin-top: var(--space-lg);
                padding: var(--space-lg);
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
                border-radius: var(--radius-lg);
                border: 1px solid var(--color-border);
            }
            
            .confidence-ring {
                position: relative;
                width: 120px;
                height: 120px;
            }
            
            .confidence-ring svg {
                transform: rotate(-90deg);
            }
            
            .confidence-ring-bg {
                fill: none;
                stroke: var(--color-bg-tertiary);
                stroke-width: 8;
            }
            
            .confidence-ring-progress {
                fill: none;
                stroke: var(--color-primary);
                stroke-width: 8;
                stroke-linecap: round;
                transition: stroke-dashoffset 1s ease, stroke 0.3s ease;
            }
            
            .confidence-ring-progress.high {
                stroke: var(--color-success);
            }
            
            .confidence-ring-progress.medium {
                stroke: var(--color-warning);
            }
            
            .confidence-ring-progress.low {
                stroke: var(--color-error);
            }
            
            .confidence-value {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: var(--font-size-3xl);
                font-weight: 800;
                color: var(--color-text-primary);
            }
            
            .confidence-info {
                flex: 1;
            }
            
            .confidence-label {
                font-size: var(--font-size-sm);
                color: var(--color-text-tertiary);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: var(--space-xs);
            }
            
            .confidence-level {
                font-size: var(--font-size-xl);
                font-weight: 700;
                margin-bottom: var(--space-sm);
            }
            
            .confidence-level.high { color: var(--color-success); }
            .confidence-level.medium { color: var(--color-warning); }
            .confidence-level.low { color: var(--color-error); }
            
            .confidence-description {
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }

    render(confidence, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const level = confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';
        const levelText = confidence >= 70 ? '🌟 Very Confident' : confidence >= 50 ? '⚡ Moderate' : '🤔 Low Confidence';
        const description = confidence >= 70
            ? 'Strong pattern detected with high reliability'
            : confidence >= 50
                ? 'Reasonable prediction based on available data'
                : 'Limited data - prediction may vary';

        const circumference = 2 * Math.PI * 54; // radius = 54
        const offset = circumference - (confidence / 100) * circumference;

        container.innerHTML = `
            <div class="confidence-display">
                <div class="confidence-ring">
                    <svg width="120" height="120">
                        <circle class="confidence-ring-bg" cx="60" cy="60" r="54"/>
                        <circle class="confidence-ring-progress ${level}" 
                                cx="60" cy="60" r="54"
                                stroke-dasharray="${circumference}"
                                stroke-dashoffset="${offset}"/>
                    </svg>
                    <div class="confidence-value">${confidence}%</div>
                </div>
                <div class="confidence-info">
                    <div class="confidence-label">Prediction Confidence</div>
                    <div class="confidence-level ${level}">${levelText}</div>
                    <div class="confidence-description">${description}</div>
                </div>
            </div>
        `;
    }
}

// Initialize all components
const themeManager = new ThemeManager();
const loadingSpinner = new LoadingSpinner();
const toastManager = new ToastManager();
const hapticFeedback = new HapticFeedback();
const confidenceDisplay = new ConfidenceDisplay();

// Export for use in main app
if (typeof window !== 'undefined') {
    window.themeManager = themeManager;
    window.loadingSpinner = loadingSpinner;
    window.toastManager = toastManager;
    window.hapticFeedback = hapticFeedback;
    window.confidenceDisplay = confidenceDisplay;
}
