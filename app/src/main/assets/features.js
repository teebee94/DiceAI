// Charts and Analytics Dashboard
// Interactive visualizations using lightweight Chart.js alternative

class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.createStyles();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dashboard-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--space-lg);
                margin-top: var(--space-lg);
            }
            
            .chart-card {
                background: var(--color-bg-card);
                backdrop-filter: blur(10px);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-xl);
                padding: var(--space-lg);
                transition: all var(--transition-base);
            }
            
            .chart-card:hover {
                border-color: var(--color-primary);
                transform: translateY(-2px);
                box-shadow: var(--shadow-xl);
            }
            
            .chart-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: var(--space-md);
            }
            
            .chart-title {
                font-size: var(--font-size-lg);
                font-weight: 700;
                color: var(--color-text-primary);
            }
            
            .chart-canvas {
                width: 100%;
                height: 200px;
                position: relative;
            }
            
            .mini-chart {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                height: 60px;
                padding: var(--space-sm);
                gap: 2px;
            }
            
            .mini-bar {
                flex: 1;
                background: var(--color-primary);
                border-radius: var(--radius-sm) var(--radius-sm) 0 0;
                transition: all var(--transition-fast);
                cursor: pointer;
                position: relative;
            }
            
            .mini-bar:hover {
                background: var(--color-primary-light);
                transform: scaleY(1.1);
            }
            
            .mini-bar.positive {
                background: linear-gradient(to top, var(--color-success), var(--color-success-light));
            }
            
            .mini-bar.negative {
                background: linear-gradient(to top, var(--color-error), var(--color-error-light));
            }
            
            .chart-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--space-md);
                margin-top: var(--space-md);
                padding-top: var(--space-md);
                border-top: 1px solid var(--color-divider);
            }
            
            .chart-stat {
                text-align: center;
            }
            
            .chart-stat-value {
                font-size: var(--font-size-xl);
                font-weight: 800;
                color: var(--color-primary);
            }
            
            .chart-stat-label {
                font-size: var(--font-size-xs);
                color: var(--color-text-tertiary);
                text-transform: uppercase;
                margin-top: var(--space-xs);
            }
        `;
        document.head.appendChild(style);
    }

    renderWinLossChart(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const last30 = data.slice(-30);
        const wins = last30.filter(d => d.won).length;
        const losses = last30.length - wins;
        const winRate = last30.length > 0 ? ((wins / last30.length) * 100).toFixed(1) : 0;

        container.innerHTML = `
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">📊 Win/Loss Trend</div>
                    <div class="badge badge-primary">${last30.length} games</div>
                </div>
                <div class="mini-chart">
                    ${last30.map(d => `
                        <div class="mini-bar ${d.won ? 'positive' : 'negative'}" 
                             style="height: ${d.won ? '100%' : '60%'}"
                             title="${d.won ? 'Win' : 'Loss'}"></div>
                    `).join('')}
                </div>
                <div class="chart-stats">
                    <div class="chart-stat">
                        <div class="chart-stat-value" style="color: var(--color-success)">${wins}</div>
                        <div class="chart-stat-label">Wins</div>
                    </div>
                    <div class="chart-stat">
                        <div class="chart-stat-value">${winRate}%</div>
                        <div class="chart-stat-label">Win Rate</div>
                    </div>
                    <div class="chart-stat">
                        <div class="chart-stat-value" style="color: var(--color-error)">${losses}</div>
                        <div class="chart-stat-label">Losses</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderFrequencyChart(frequency, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const numbers = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
        const max = Math.max(...Object.values(frequency), 1);
        const total = Object.values(frequency).reduce((a, b) => a + b, 0);

        container.innerHTML = `
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">🔢 Number Frequency</div>
                    <div class="badge badge-primary">${total} rolls</div>
                </div>
                <div class="mini-chart">
                    ${Array.from({ length: 16 }, (_, i) => i + 3).map(num => {
            const count = frequency[num] || 0;
            const height = (count / max * 100);
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            return `
                            <div class="mini-bar" 
                                 style="height: ${height}%"
                                 title="${num}: ${count} (${percentage}%)"></div>
                        `;
        }).join('')}
                </div>
                <div class="chart-stats">
                    <div class="chart-stat">
                        <div class="chart-stat-value">${numbers[0]?.[0] || '-'}</div>
                        <div class="chart-stat-label">Most Common</div>
                    </div>
                    <div class="chart-stat">
                        <div class="chart-stat-value">${numbers[0]?.[1] || 0}</div>
                        <div class="chart-stat-label">Occurrences</div>
                    </div>
                    <div class="chart-stat">
                        <div class="chart-stat-value">${numbers[numbers.length - 1]?.[0] || '-'}</div>
                        <div class="chart-stat-label">Least Common</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStreakChart(history, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let currentStreak = 0;
        let longestStreak = 0;
        let streakType = null;

        history.forEach((entry, i) => {
            const won = entry.won;
            if (i === 0) {
                currentStreak = 1;
                streakType = won;
                longestStreak = 1;
            } else if (won === streakType) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
                streakType = won;
            }
        });

        container.innerHTML = `
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">🔥 Streak Tracker</div>
                    <div class="badge ${currentStreak >= 3 ? 'badge-success' : 'badge-primary'}">
                        ${currentStreak >= 3 ? 'Hot!' : 'Active'}
                    </div>
                </div>
                <div style="text-align: center; padding: var(--space-xl) 0;">
                    <div style="font-size: var(--font-size-4xl); font-weight: 800; 
                                background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                                -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ${currentStreak}
                    </div>
                    <div style="color: var(--color-text-secondary); margin-top: var(--space-sm);">
                        Current Streak
                    </div>
                </div>
                <div class="chart-stats">
                    <div class="chart-stat">
                        <div class="chart-stat-value">${longestStreak}</div>
                        <div class="chart-stat-label">Longest</div>
                    </div>
                    <div class="chart-stat">
                        <div class="chart-stat-value">${streakType ? '✅' : '❌'}</div>
                        <div class="chart-stat-label">Type</div>
                    </div>
                    <div class="chart-stat">
                        <div class="chart-stat-value">${currentStreak >= 5 ? '🔥' : '-'}</div>
                        <div class="chart-stat-label">Status</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Gamification System
class GamificationSystem {
    constructor() {
        this.achievements = {
            first_win: { id: 'first_win', name: 'First Blood', emoji: '🎯', desc: 'Get your first correct prediction', unlocked: false },
            streak_3: { id: 'streak_3', name: 'Hat Trick', emoji: '🎩', desc: '3 correct predictions in a row', unlocked: false },
            streak_5: { id: 'streak_5', name: 'On Fire', emoji: '🔥', desc: '5 correct predictions in a row', unlocked: false },
            streak_10: { id: 'streak_10', name: 'Unstoppable', emoji: '⚡', desc: '10 correct predictions in a row', unlocked: false },
            total_100: { id: 'total_100', name: 'Century', emoji: '💯', desc: 'Make 100 predictions', unlocked: false },
            total_500: { id: 'total_500', name: 'Veteran', emoji: '🏆', desc: 'Make 500 predictions', unlocked: false },
            accuracy_70: { id: 'accuracy_70', name: 'Sharp Shooter', emoji: '🎲', desc: 'Reach 70% accuracy', unlocked: false },
            accuracy_90: { id: 'accuracy_90', name: 'Master Predictor', emoji: '👑', desc: 'Reach 90% accuracy', unlocked: false }
        };

        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;

        this.loadProgress();
        this.createStyles();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-unlock {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: var(--color-bg-card);
                backdrop-filter: blur(20px);
                border: 2px solid var(--color-primary);
                border-radius: var(--radius-xl);
                padding: var(--space-2xl);
                box-shadow: var(--shadow-xl), 0 0 50px rgba(139, 92, 246, 0.5);
                z-index: 10001;
                text-align: center;
                min-width: 350px;
                animation: achievementPop 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
            }
            
            @keyframes achievementPop {
                0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
                70% { transform: translate(-50%, -50%) scale(1.1) rotate(10deg); }
                100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
            }
            
            .achievement-emoji {
                font-size: 64px;
                margin-bottom: var(--space-md);
                animation: bounce 0.6s ease infinite alternate;
            }
            
            @keyframes bounce {
                from { transform: translateY(0); }
                to { transform: translateY(-10px); }
            }
            
            .achievement-title {
                font-size: var(--font-size-2xl);
                font-weight: 800;
                color: var(--color-primary-light);
                margin-bottom: var(--space-sm);
            }
            
            .achievement-desc {
                color: var(--color-text-secondary);
                margin-bottom: var(--space-lg);
            }
            
            .level-display {
                display: inline-flex;
                align-items: center;
                gap: var(--space-sm);
                padding: var(--space-xs) var(--space-md);
                background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                border-radius: var(--radius-full);
                font-weight: 700;
                color: white;
                font-size: var(--font-size-sm);
            }
            
            .xp-bar {
                width: 100%;
                height: 24px;
                background: var(--color-bg-tertiary);
                border-radius: var(--radius-full);
                overflow: hidden;
                margin-top: var(--space-sm);
                position: relative;
            }
            
            .xp-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
                border-radius: var(--radius-full);
                transition: width 0.5s ease;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: var(--space-sm);
                color: white;
                font-size: var(--font-size-xs);
                font-weight: 700;
            }
            
            .confetti {
                position: fixed;
                width: 10px;
                height: 10px;
                background: var(--color-primary);
                position: absolute;
                animation: confetti-fall 3s linear forwards;
                z-index: 10000;
            }
            
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addXP(amount) {
        this.xp += amount;

        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.levelUp();
        }

        this.saveProgress();
        this.updateXPDisplay();
    }

    levelUp() {
        this.level++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);

        if (window.toastManager) {
            window.toastManager.show(`Level Up! You're now level ${this.level} 🎉`, 'success');
        }

        if (window.hapticFeedback) {
            window.hapticFeedback.success();
        }

        this.celebrateLevel();
    }

    celebrateLevel() {
        this.createConfetti(30);
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        this.showAchievementPopup(achievement);
        this.saveProgress();

        if (window.hapticFeedback) {
            window.hapticFeedback.heavy();
        }

        this.createConfetti(50);
    }

    showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-unlock';
        popup.innerHTML = `
            <div class="achievement-emoji">${achievement.emoji}</div>
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-title">${achievement.name}</div>
            <div class="achievement-desc">${achievement.desc}</div>
            <button class="btn btn-primary" onclick="this.parentElement.remove()">Awesome!</button>
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            if (popup.parentElement) {
                popup.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => popup.remove(), 300);
            }
        }, 4000);
    }

    createConfetti(count) {
        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    updateXPDisplay() {
        const xpBar = document.getElementById('xpBar');
        if (xpBar) {
            const percentage = (this.xp / this.xpToNextLevel) * 100;
            xpBar.innerHTML = `<div class="xp-fill" style="width: ${percentage}%">${this.xp}/${this.xpToNextLevel} XP</div>`;
        }

        const levelDisplay = document.getElementById('levelDisplay');
        if (levelDisplay) {
            levelDisplay.innerHTML = `⭐ Level ${this.level}`;
        }
    }

    checkAchievements(stats) {
        if (stats.wins >= 1) this.unlockAchievement('first_win');
        if (stats.currentStreak >= 3) this.unlockAchievement('streak_3');
        if (stats.currentStreak >= 5) this.unlockAchievement('streak_5');
        if (stats.currentStreak >= 10) this.unlockAchievement('streak_10');
        if (stats.total >= 100) this.unlockAchievement('total_100');
        if (stats.total >= 500) this.unlockAchievement('total_500');
        if (stats.accuracy >= 70) this.unlockAchievement('accuracy_70');
        if (stats.accuracy >= 90) this.unlockAchievement('accuracy_90');
    }

    saveProgress() {
        localStorage.setItem('diceai_gamification', JSON.stringify({
            level: this.level,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            achievements: this.achievements
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('diceai_gamification');
        if (saved) {
            const data = JSON.parse(saved);
            this.level = data.level || 1;
            this.xp = data.xp || 0;
            this.xpToNextLevel = data.xpToNextLevel || 100;
            if (data.achievements) {
                Object.assign(this.achievements, data.achievements);
            }
        }
    }
}

// Initialize
const analyticsDashboard = new AnalyticsDashboard();
const gamificationSystem = new GamificationSystem();

if (typeof window !== 'undefined') {
    window.analyticsDashboard = analyticsDashboard;
    window.gamificationSystem = gamificationSystem;
}
