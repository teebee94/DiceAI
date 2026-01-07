// Undo/Redo History Manager
class HistoryManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
        this.maxSize = 10;

        this.setupKeyboardShortcuts();
        this.createUI();
    }

    createUI() {
        const style = document.createElement('style');
        style.textContent = `
            .undo-redo-btns {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                gap: var(--space-sm);
                z-index: 1000;
            }
            
            .undo-btn, .redo-btn {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: var(--color-primary);
                color: white;
                border: none;
                cursor: pointer;
                font-size: var(--font-size-lg);
                box-shadow: var(--shadow-lg);
                transition: all var(--transition-fast);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .undo-btn:hover, .redo-btn:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-xl);
            }
            
            .undo-btn:disabled, .redo-btn:disabled {
                background: var(--color-bg-tertiary);
                color: var(--color-text-muted);
                cursor: not-allowed;
                opacity: 0.5;
            }
        `;
        document.head.appendChild(style);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                this.redo();
            }
        });
    }

    recordAction(action) {
        this.undoStack.push(action);
        if (this.undoStack.length > this.maxSize) {
            this.undoStack.shift();
        }
        this.redoStack = [];
        this.updateUI();
    }

    undo() {
        if (this.undoStack.length === 0) return;

        const action = this.undoStack.pop();
        action.undo();
        this.redoStack.push(action);
        this.updateUI();

        if (window.toastManager) {
            window.toastManager.show('Action undone', 'info', 1500);
        }

        if (window.hapticFeedback) {
            window.hapticFeedback.light();
        }
    }

    redo() {
        if (this.redoStack.length === 0) return;

        const action = this.redoStack.pop();
        action.redo();
        this.undoStack.push(action);
        this.updateUI();

        if (window.toastManager) {
            window.toastManager.show('Action redone', 'info', 1500);
        }

        if (window.hapticFeedback) {
            window.hapticFeedback.light();
        }
    }

    updateUI() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');

        if (undoBtn) {
            undoBtn.disabled = this.undoStack.length === 0;
            undoBtn.title = `Undo (Ctrl+Z) - ${this.undoStack.length} action(s)`;
        }

        if (redoBtn) {
            redoBtn.disabled = this.redoStack.length === 0;
            redoBtn.title = `Redo (Ctrl+Y) - ${this.redoStack.length} action(s)`;
        }
    }
}

// Smart Suggestions System
class SmartSuggestions {
    constructor() {
        this.createStyles();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .suggestions-card {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
                border: 1px solid var(--color-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
                margin-top: var(--space-md);
            }
            
            .suggestion-item {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-sm);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-sm);
                transition: all var(--transition-fast);
            }
            
            .suggestion-item:hover {
                background: var(--color-bg-hover);
            }
            
            .suggestion-icon {
                font-size: var(--font-size-2xl);
                flex-shrink: 0;
            }
            
            .suggestion-content {
                flex: 1;
            }
            
            .suggestion-title {
                font-weight: 700;
                color: var(--color-text-primary);
                margin-bottom: 2px;
            }
            
            .suggestion-desc {
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
            }
        `;
        document.head.appendChild(style);
    }

    analyze(data) {
        const suggestions = [];

        // Check play time patterns
        if (data.history.length > 20) {
            const hourCounts = {};
            data.history.forEach(entry => {
                const hour = new Date(entry.timestamp).getHours();
                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            });

            const bestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
            if (bestHour) {
                suggestions.push({
                    icon: '⏰',
                    title: `Best Time: ${bestHour[0]}:00`,
                    desc: `You play most often at this hour (${bestHour[1]} times)`
                });
            }
        }

        // Check accuracy
        if (data.accuracy >= 75) {
            suggestions.push({
                icon: '🎯',
                title: 'Excellent Performance!',
                desc: `${data.accuracy}% accuracy - You're doing great!`
            });
        } else if (data.accuracy < 50 && data.total > 10) {
            suggestions.push({
                icon: '💡',
                title: 'Tip: More Data Needed',
                desc: 'Add more entries to improve prediction accuracy'
            });
        }

        // Check streak
        if (data.currentStreak >= 5) {
            suggestions.push({
                icon: '🔥',
                title: `${data.currentStreak} Win Streak!`,
                desc: 'You\'re on fire! Keep it going!'
            });
        }

        // Number pattern suggestion
        if (data.frequency) {
            const leastCommon = Object.entries(data.frequency).sort((a, b) => a[1] - b[1])[0];
            if (leastCommon && leastCommon[1] === 0) {
                suggestions.push({
                    icon: '🎲',
                    title: `Number ${leastCommon[0]} Not Seen`,
                    desc: 'This number hasn\'t appeared yet - consider it!'
                });
            }
        }

        return suggestions;
    }

    render(suggestions, containerId) {
        const container = document.getElementById(containerId);
        if (!container || suggestions.length === 0) return;

        container.innerHTML = `
            <div class="suggestions-card">
                <div style="font-weight: 700; margin-bottom: var(--space-md); color: var(--color-primary);">
                    💡 Smart Insights
                </div>
                ${suggestions.map(s => `
                    <div class="suggestion-item">
                        <div class="suggestion-icon">${s.icon}</div>
                        <div class="suggestion-content">
                            <div class="suggestion-title">${s.title}</div>
                            <div class="suggestion-desc">${s.desc}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Copy to Clipboard Utility
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            if (window.toastManager) {
                window.toastManager.show('📋 Copied to clipboard!', 'success', 2000);
            }
            if (window.hapticFeedback) {
                window.hapticFeedback.light();
            }
        }).catch(err => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    if (window.toastManager) {
        window.toastManager.show('📋 Copied to clipboard!', 'success', 2000);
    }
}

// Initialize
const historyManager = new HistoryManager();
const smartSuggestions = new SmartSuggestions();

if (typeof window !== 'undefined') {
    window.historyManager = historyManager;
    window.smartSuggestions = smartSuggestions;
    window.copyToClipboard = copyToClipboard;
}
