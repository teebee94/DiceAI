// =======================================
// Automation Engine
// Smart betting & strategy recommendations
// =======================================

class AutomationEngine {
    constructor(app) {
        this.app = app;
        this.settings = this.loadSettings();
    }

    // Get smart betting suggestion
    getBettingSuggestion() {
        const top3 = this.app.advancedPredictor?.getNext3Predictions();
        if (!top3 || top3.length === 0) {
            return {
                shouldBet: false,
                reason: 'Insufficient data for prediction',
                suggestion: 'Upload more historical data'
            };
        }

        const best = top3[0];
        const analytics = this.app.analyticsEngine?.getWinLossStats();
        const streaks = this.app.analyticsEngine?.getStreakStats();

        // Decision logic
        let shouldBet = false;
        let confidence = 'low';
        let betAmount = 0;
        let reason = '';

        // High confidence + good accuracy
        if (best.confidence >= 70 && analytics?.accuracy >= 50) {
            shouldBet = true;
            confidence = 'high';
            betAmount = this.settings.maxBet;
            reason = `High confidence (${best.confidence}%) + Good accuracy (${analytics.accuracy}%)`;
        }
        // Medium confidence + win streak
        else if (best.confidence >= 60 && streaks?.currentStreakType === 'win' && streaks?.currentStreak >= 3) {
            shouldBet = true;
            confidence = 'medium';
            betAmount = this.settings.maxBet * 0.7;
            reason = `Good confidence + ${streaks.currentStreak}-win streak`;
        }
        // Decent confidence + low risk
        else if (best.confidence >= 55 && best.risk <= 3) {
            shouldBet = true;
            confidence = 'low';
            betAmount = this.settings.maxBet * 0.5;
            reason = `Decent confidence + Low risk (${best.risk}/10)`;
        }
        // Loss streak - be cautious
        else if (streaks?.currentStreakType === 'loss' && streaks?.currentStreak >= 3) {
            shouldBet = false;
            reason = `On ${streaks.currentStreak}-loss streak - skip this round`;
        }
        // Low confidence
        else if (best.confidence < 55) {
            shouldBet = false;
            reason = `Low confidence (${best.confidence}%) - wait for better opportunity`;
        }
        else {
            shouldBet = false;
            reason = 'Conditions not optimal';
        }

        return {
            shouldBet,
            confidence,
            betAmount: Math.round(betAmount),
            prediction: best,
            alternatives: top3.slice(1, 3),
            reason,
            riskLevel: best.risk,
            recommendation: this.getRecommendation(shouldBet, confidence, best)
        };
    }

    // Get recommendation text
    getRecommendation(shouldBet, confidence, prediction) {
        if (!shouldBet) {
            return '🚫 Skip this round and wait for better conditions';
        }

        const recs = [];

        if (confidence === 'high') {
            recs.push(`✅ Strong bet on ${prediction.number}`);
            recs.push(`💰 Bet ${this.settings.maxBet} units (max)`);
        } else if (confidence === 'medium') {
            recs.push(`⚡ Moderate bet on ${prediction.number}`);
            recs.push(`💰 Bet ${Math.round(this.settings.maxBet * 0.7)} units (70%)`);
        } else {
            recs.push(`⚠️ Small bet on ${prediction.number}`);
            recs.push(`💰 Bet ${Math.round(this.settings.maxBet * 0.5)} units (50%)`);
        }

        recs.push(`🎯 Confidence: ${prediction.confidence}%`);
        recs.push(`⚖️ Risk: ${prediction.risk}/10`);

        return recs.join('\n');
    }

    // Get best time to play
    getBestTiming() {
        const hourly = this.app.analyticsEngine?.getTimeBasedStats();
        if (!hourly || !hourly.hourlyStats) {
            return {
                bestHours: [],
                worstHours: [],
                recommendation: 'Need more data to analyze timing'
            };
        }

        // Find hours with data
        const hoursWithData = hourly.hourlyStats
            .map((stats, hour) => ({ hour, ...stats }))
            .filter(h => h.total >= 3); // Minimum 3 predictions

        if (hoursWithData.length === 0) {
            return {
                bestHours: [],
                worstHours: [],
                recommendation: 'Not enough time-based data yet'
            };
        }

        // Sort by accuracy
        const sorted = [...hoursWithData].sort((a, b) => b.accuracy - a.accuracy);
        const bestHours = sorted.slice(0, 3).map(h => ({
            hour: h.hour,
            accuracy: h.accuracy,
            predictions: h.total
        }));
        const worstHours = sorted.slice(-3).reverse().map(h => ({
            hour: h.hour,
            accuracy: h.accuracy,
            predictions: h.total
        }));

        const currentHour = new Date().getHours();
        const currentStats = hourly.hourlyStats[currentHour];
        const isGoodTime = currentStats.total >= 3 && currentStats.accuracy >= 55;

        return {
            bestHours,
            worstHours,
            currentHour,
            isGoodTimeNow: isGoodTime,
            recommendation: this.getTimingRecommendation(bestHours, currentHour, isGoodTime)
        };
    }

    // Get timing recommendation
    getTimingRecommendation(bestHours, currentHour, isGoodTime) {
        if (bestHours.length === 0) {
            return 'Continue playing to gather timing data';
        }

        if (isGoodTime) {
            return `✅ Good time to play! Current hour (${currentHour}:00) has good accuracy`;
        }

        const bestHoursList = bestHours.map(h => `${h.hour}:00 (${h.accuracy}%)`).join(', ');
        return `⏰ Best times: ${bestHoursList}`;
    }

    // Pattern-based strategy
    getPatternStrategy() {
        const patterns = this.app.analyticsEngine?.getPatternFrequency();
        if (!patterns) {
            return { strategy: 'neutral', reason: 'No pattern data' };
        }

        const total = patterns.bigSmall.big + patterns.bigSmall.small;
        if (total < 20) {
            return { strategy: 'neutral', reason: 'Need more data (< 20 results)' };
        }

        const bigPercent = (patterns.bigSmall.big / total) * 100;
        const recentHistory = this.app.predictionEngine?.history.slice(-10) || [];
        const recentBig = recentHistory.filter(n => n >= 11).length;

        let strategy = 'neutral';
        let reason = '';
        let recommendation = '';

        // Strong Big trend
        if (bigPercent > 65 && recentBig >= 7) {
            strategy = 'big';
            reason = `${Math.round(bigPercent)}% Big overall, ${recentBig}/10 recent are Big`;
            recommendation = '📈 Focus on Big numbers (11-18)';
        }
        // Strong Small trend
        else if (bigPercent < 35 && recentBig <= 3) {
            strategy = 'small';
            reason = `${Math.round(100 - bigPercent)}% Small overall, ${10 - recentBig}/10 recent are Small`;
            recommendation = '📉 Focus on Small numbers (3-10)';
        }
        // Reversion opportunity
        else if ((bigPercent > 70 && recentBig < 5) || (bigPercent < 30 && recentBig > 5)) {
            strategy = 'reversion';
            reason = 'Pattern showing signs of reversal';
            recommendation = '🔄 Consider reversion play (bet against trend)';
        }
        // Balanced
        else {
            strategy = 'balanced';
            reason = 'No strong pattern detected';
            recommendation = '⚖️ Use balanced strategy (any number)';
        }

        return {
            strategy,
            reason,
            recommendation,
            bigPercent: Math.round(bigPercent),
            smallPercent: Math.round(100 - bigPercent)
        };
    }

    // Risk management check
    getRiskManagement() {
        const stats = this.app.analyticsEngine?.getWinLossStats();
        const streaks = this.app.analyticsEngine?.getStreakStats();
        const profitLoss = this.app.analyticsEngine?.getProfitLossStats(this.settings.maxBet, 1);

        if (!stats || stats.totalPredictions < 10) {
            return {
                status: 'building',
                alerts: ['Need 10+ predictions for risk analysis'],
                shouldPause: false
            };
        }

        const alerts = [];
        let shouldPause = false;
        let status = 'good';

        // Check accuracy
        if (stats.accuracy < 40) {
            alerts.push(`⚠️ Low accuracy: ${stats.accuracy}%`);
            status = 'warning';
        }

        // Check loss streak
        if (streaks?.currentStreakType === 'loss' && streaks?.currentStreak >= 5) {
            alerts.push(`🛑 Loss streak: ${streaks.currentStreak} in a row`);
            shouldPause = true;
            status = 'danger';
        }

        // Check profit/loss
        if (profitLoss && profitLoss.netProfit < -this.settings.maxBet * 10) {
            alerts.push(`💸 Heavy losses: ${profitLoss.netProfit} units`);
            shouldPause = true;
            status = 'danger';
        }

        // Check ROI
        if (profitLoss && profitLoss.roi < -20) {
            alerts.push(`📉 Negative ROI: ${profitLoss.roi}%`);
            status = 'warning';
        }

        return {
            status,
            alerts,
            shouldPause,
            recommendation: shouldPause ?
                '🛑 PAUSE betting and review strategy' :
                status === 'warning' ?
                    '⚠️ Reduce bet amounts and monitor closely' :
                    '✅ Risk levels acceptable'
        };
    }

    // Get complete automation report
    getFullReport() {
        return {
            betting: this.getBettingSuggestion(),
            timing: this.getBestTiming(),
            pattern: this.getPatternStrategy(),
            risk: this.getRiskManagement()
        };
    }

    // Update settings
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    // Save settings
    saveSettings() {
        localStorage.setItem('automationSettings', JSON.stringify(this.settings));
    }

    // Load settings
    loadSettings() {
        const saved = localStorage.getItem('automationSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            maxBet: 10,
            autoAlerts: true,
            conservativeMode: false
        };
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutomationEngine;
}
