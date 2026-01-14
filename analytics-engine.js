// =======================================
// Analytics Engine
// Track performance, streaks, and statistics
// =======================================

class AnalyticsEngine {
    constructor(app) {
        this.app = app;
    }

    // Calculate win/loss statistics
    getWinLossStats() {
        const metadata = this.app.currentData.metadata;
        const learningEngine = this.app.currentData.learningEngine;

        if (!metadata || metadata.length === 0) {
            return {
                totalPredictions: 0,
                correctPredictions: 0,
                wrongPredictions: 0,
                accuracy: 0,
                winRate: 0
            };
        }

        // Count predictions with feedback
        const withFeedback = metadata.filter(m => m.predictedCorrectly !== undefined);
        const correct = withFeedback.filter(m => m.predictedCorrectly === true).length;
        const wrong = withFeedback.filter(m => m.predictedCorrectly === false).length;
        const total = withFeedback.length;

        return {
            totalPredictions: total,
            correctPredictions: correct,
            wrongPredictions: wrong,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
            winRate: total > 0 ? (correct / total) : 0
        };
    }

    // Track streaks (winning/losing)
    getStreakStats() {
        const metadata = this.app.currentData.metadata;

        if (!metadata || metadata.length === 0) {
            return {
                currentStreak: 0,
                currentStreakType: null,
                bestWinStreak: 0,
                bestLossStreak: 0
            };
        }

        let currentStreak = 0;
        let currentStreakType = null;
        let bestWinStreak = 0;
        let bestLossStreak = 0;
        let tempWinStreak = 0;
        let tempLossStreak = 0;

        // Reverse to go chronologically
        const chronological = [...metadata].reverse();

        chronological.forEach((entry, index) => {
            if (entry.predictedCorrectly === true) {
                tempWinStreak++;
                tempLossStreak = 0;

                if (index === chronological.length - 1) {
                    currentStreak = tempWinStreak;
                    currentStreakType = 'win';
                }

                bestWinStreak = Math.max(bestWinStreak, tempWinStreak);
            } else if (entry.predictedCorrectly === false) {
                tempLossStreak++;
                tempWinStreak = 0;

                if (index === chronological.length - 1) {
                    currentStreak = tempLossStreak;
                    currentStreakType = 'loss';
                }

                bestLossStreak = Math.max(bestLossStreak, tempLossStreak);
            }
        });

        return {
            currentStreak,
            currentStreakType,
            bestWinStreak,
            bestLossStreak
        };
    }

    // Time-based performance (hourly breakdown)
    getTimeBasedStats() {
        const metadata = this.app.currentData.metadata;

        if (!metadata || metadata.length === 0) {
            return { hourlyStats: [] };
        }

        const hourlyData = new Array(24).fill(null).map(() => ({
            total: 0,
            correct: 0,
            accuracy: 0
        }));

        metadata.forEach(entry => {
            if (entry.timestamp && entry.predictedCorrectly !== undefined) {
                const hour = new Date(entry.timestamp).getHours();
                hourlyData[hour].total++;
                if (entry.predictedCorrectly) {
                    hourlyData[hour].correct++;
                }
            }
        });

        // Calculate accuracy for each hour
        hourlyData.forEach(data => {
            data.accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        });

        return { hourlyStats: hourlyData };
    }

    // Profit/Loss calculator (assuming 1 unit bet per prediction)
    getProfitLossStats(betAmount = 1, winMultiplier = 1) {
        const { correctPredictions, wrongPredictions } = this.getWinLossStats();

        const profit = correctPredictions * betAmount * winMultiplier;
        const loss = wrongPredictions * betAmount;
        const netProfit = profit - loss;
        const roi = (correctPredictions + wrongPredictions) > 0 ?
            ((netProfit / ((correctPredictions + wrongPredictions) * betAmount)) * 100) : 0;

        return {
            totalBet: (correctPredictions + wrongPredictions) * betAmount,
            totalProfit: profit,
            totalLoss: loss,
            netProfit,
            roi: Math.round(roi * 100) / 100
        };
    }

    // Success rate over time (for charting)
    getSuccessRateOverTime(windowSize = 10) {
        const metadata = this.app.currentData.metadata;

        if (!metadata || metadata.length === 0) {
            return { labels: [], data: [] };
        }

        const withFeedback = metadata.filter(m => m.predictedCorrectly !== undefined);
        const labels = [];
        const data = [];

        for (let i = windowSize - 1; i < withFeedback.length; i++) {
            const window = withFeedback.slice(i - windowSize + 1, i + 1);
            const correct = window.filter(m => m.predictedCorrectly).length;
            const accuracy = Math.round((correct / windowSize) * 100);

            labels.push(`#${i + 1}`);
            data.push(accuracy);
        }

        return { labels, data };
    }

    // Pattern frequency analysis
    getPatternFrequency() {
        const metadata = this.app.currentData.metadata;

        if (!metadata || metadata.length === 0) {
            return {
                bigSmall: { big: 0, small: 0 },
                oddEven: { odd: 0, even: 0 },
                sumDistribution: new Array(16).fill(0) // 3-18
            };
        }

        const stats = {
            bigSmall: { big: 0, small: 0 },
            oddEven: { odd: 0, even: 0 },
            sumDistribution: new Array(16).fill(0)
        };

        metadata.forEach(entry => {
            // Big/Small
            if (entry.isBig) stats.bigSmall.big++;
            else stats.bigSmall.small++;

            // Odd/Even
            if (entry.isEven) stats.oddEven.even++;
            else stats.oddEven.odd++;

            // Sum distribution (index 0 = sum 3, index 15 = sum 18)
            if (entry.number >= 3 && entry.number <= 18) {
                stats.sumDistribution[entry.number - 3]++;
            }
        });

        return stats;
    }

    // Get top performing algorithms
    getTopAlgorithms() {
        const learningEngine = this.app.currentData.learningEngine;

        if (!learningEngine || !learningEngine.algorithmWeights) {
            return [];
        }

        const weights = Object.entries(learningEngine.algorithmWeights)
            .map(([algo, weight]) => ({
                algorithm: algo,
                weight: Math.round(weight * 100) / 100,
                percentage: Math.round(weight * 100)
            }))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 5);

        return weights;
    }

    // Recent performance (last N predictions)
    getRecentPerformance(count = 20) {
        const metadata = this.app.currentData.metadata;

        if (!metadata || metadata.length === 0) {
            return { recent: [], accuracy: 0 };
        }

        const withFeedback = metadata.filter(m => m.predictedCorrectly !== undefined);
        const recent = withFeedback.slice(-count);
        const correct = recent.filter(m => m.predictedCorrectly).length;
        const accuracy = recent.length > 0 ? Math.round((correct / recent.length) * 100) : 0;

        return {
            recent: recent.map(r => r.predictedCorrectly),
            accuracy,
            total: recent.length
        };
    }

    // Generate comprehensive analytics report
    getFullReport() {
        return {
            winLoss: this.getWinLossStats(),
            streaks: this.getStreakStats(),
            timeBased: this.getTimeBasedStats(),
            profitLoss: this.getProfitLossStats(),
            patterns: this.getPatternFrequency(),
            topAlgorithms: this.getTopAlgorithms(),
            recentPerformance: this.getRecentPerformance()
        };
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsEngine;
}
