// =======================================
// Notification Manager
// Browser notifications & alerts
// =======================================

class NotificationManager {
    constructor(app) {
        this.app = app;
        this.enabled = this.loadSettings();
        this.soundEnabled = true;
        this.lastNotification = null;

        // Request permission on init
        this.requestPermission();
    }

    // Request browser notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('Browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Send browser notification
    async notify(title, body, options = {}) {
        if (!this.enabled) return;

        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
            console.log('Notification permission denied');
            return;
        }

        const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: options.tag || 'diceai',
            requireInteraction: options.requireInteraction || false,
            ...options
        });

        if (this.soundEnabled && options.sound !== false) {
            this.playSound();
        }

        this.lastNotification = { title, body, timestamp: Date.now() };

        notification.onclick = () => {
            window.focus();
            notification.close();
            if (options.onClick) options.onClick();
        };

        return notification;
    }

    // Play notification sound
    playSound() {
        // Simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Could not play sound:', e);
        }
    }

    // High confidence prediction alert
    alertHighConfidence(prediction) {
        if (prediction.confidence >= 65) {
            this.notify(
                '🎯 High Confidence Prediction!',
                `Predicted: ${prediction.number} with ${prediction.confidence}% confidence`,
                {
                    tag: 'high-confidence',
                    requireInteraction: true
                }
            );
        }
    }

    // Pattern detection alert
    alertPattern(patternType, details) {
        const messages = {
            'hot-streak': `🔥 Hot Streak Detected! ${details}`,
            'cold-streak': `❄️ Cold Streak Alert! ${details}`,
            'big-trend': `📈 Big Numbers Trending! ${details}`,
            'small-trend': `📉 Small Numbers Trending! ${details}`,
            'unusual': `⚠️ Unusual Pattern! ${details}`
        };

        const message = messages[patternType] || details;

        this.notify(
            'Pattern Detected',
            message,
            { tag: 'pattern-alert' }
        );
    }

    // Streak warning
    alertStreak(streakType, count) {
        if (count >= 5) {
            const emoji = streakType === 'win' ? '🔥' : '⚠️';
            const title = streakType === 'win' ? 'Amazing Win Streak!' : 'Losing Streak Warning';
            const body = `You're on a ${count}-prediction ${streakType} streak!`;

            this.notify(
                `${emoji} ${title}`,
                body,
                {
                    tag: 'streak-alert',
                    requireInteraction: streakType === 'loss'
                }
            );
        }
    }

    // Daily summary
    sendDailySummary() {
        const stats = this.app.analyticsEngine?.getWinLossStats();
        if (!stats || stats.totalPredictions === 0) return;

        const streaks = this.app.analyticsEngine?.getStreakStats();

        this.notify(
            '📊 Daily Summary',
            `Accuracy: ${stats.accuracy}% | Predictions: ${stats.totalPredictions} | Current Streak: ${streaks?.currentStreak || 0}`,
            {
                tag: 'daily-summary',
                sound: false
            }
        );
    }

    // Check for alerts (call this after predictions/updates)
    checkAlerts() {
        // Check current prediction
        if (this.app.lastPrediction) {
            this.alertHighConfidence(this.app.lastPrediction);
        }

        // Check streaks
        const streaks = this.app.analyticsEngine?.getStreakStats();
        if (streaks?.currentStreak >= 5) {
            this.alertStreak(streaks.currentStreakType, streaks.currentStreak);
        }

        // Check patterns
        this.checkPatterns();
    }

    // Check for unusual patterns
    checkPatterns() {
        const patterns = this.app.analyticsEngine?.getPatternFrequency();
        if (!patterns) return;

        const total = patterns.bigSmall.big + patterns.bigSmall.small;
        if (total < 20) return; // Need minimum data

        // Big numbers trending (>70%)
        const bigPercent = (patterns.bigSmall.big / total) * 100;
        if (bigPercent > 70) {
            this.alertPattern('big-trend', `${Math.round(bigPercent)}% of recent results are Big`);
        }

        // Small numbers trending (>70%)
        if (bigPercent < 30) {
            this.alertPattern('small-trend', `${Math.round(100 - bigPercent)}% of recent results are Small`);
        }

        // Check for hot numbers
        const recentHistory = this.app.predictionEngine?.history.slice(-20) || [];
        const frequency = {};
        recentHistory.forEach(n => {
            frequency[n] = (frequency[n] || 0) + 1;
        });

        const hotNumbers = Object.entries(frequency)
            .filter(([_, count]) => count >= 5)
            .map(([num]) => num);

        if (hotNumbers.length > 0) {
            this.alertPattern('hot-streak', `Numbers ${hotNumbers.join(', ')} are appearing frequently`);
        }
    }

    // Enable/disable notifications
    toggle(enabled) {
        this.enabled = enabled;
        this.saveSettings();
    }

    // Enable/disable sound
    toggleSound(enabled) {
        this.soundEnabled = enabled;
        this.saveSettings();
    }

    // Save settings
    saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify({
            enabled: this.enabled,
            soundEnabled: this.soundEnabled
        }));
    }

    // Load settings
    loadSettings() {
        const saved = localStorage.getItem('notificationSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.soundEnabled = settings.soundEnabled !== false;
            return settings.enabled !== false;
        }
        return true; // Enabled by default
    }

    // Show in-app alert (fallback)
    showInAppAlert(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: var(--color-bg-card);
            border-left: 4px solid ${type === 'success' ? 'var(--color-success)' : 'var(--color-warning)'};
            border-radius: var(--radius-sm);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            color: var(--color-text);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
