// =======================================
// Adaptive Learning Engine
// Self-Training & Feedback System
// =======================================

class LearningEngine {
    constructor(predictionEngine) {
        this.predictionEngine = predictionEngine;
        this.feedbackHistory = [];
        this.algorithmPerformance = this.initializePerformance();
        this.learningRate = 0.1; // How fast weights adjust
        this.minWeight = 0.1; // Minimum algorithm weight
        this.maxWeight = 3.0; // Maximum algorithm weight
    }

    // Initialize performance tracking for each algorithm
    initializePerformance() {
        const performance = {};
        for (const algoName in this.predictionEngine.algorithms) {
            performance[algoName] = {
                predictions: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0,
                recentCorrect: [],
                confidenceSum: 0
            };
        }
        return performance;
    }

    // Record feedback for a prediction
    recordFeedback(prediction, actualNumber, isCorrect) {
        const feedback = {
            timestamp: Date.now(),
            predicted: prediction.number,
            actual: actualNumber,
            isCorrect,
            confidence: prediction.confidence,
            contributors: prediction.contributors || []
        };

        this.feedbackHistory.push(feedback);

        // Update algorithm performance
        if (prediction.contributors) {
            prediction.contributors.forEach(algoName => {
                if (this.algorithmPerformance[algoName]) {
                    this.updateAlgorithmPerformance(algoName, isCorrect);
                }
            });
        }

        // Adjust weights based on feedback
        this.adjustWeights();

        return {
            totalFeedback: this.feedbackHistory.length,
            overallAccuracy: this.getOverallAccuracy()
        };
    }

    // Update individual algorithm performance
    updateAlgorithmPerformance(algoName, isCorrect) {
        const perf = this.algorithmPerformance[algoName];
        perf.predictions++;

        if (isCorrect) {
            perf.correct++;
            perf.recentCorrect.push(1);
        } else {
            perf.incorrect++;
            perf.recentCorrect.push(0);
        }

        // Keep only last 20 predictions for recent performance
        if (perf.recentCorrect.length > 20) {
            perf.recentCorrect.shift();
        }

        // Update accuracy
        perf.accuracy = perf.predictions > 0 ? (perf.correct / perf.predictions) * 100 : 0;
    }

    // Dynamically adjust algorithm weights based on performance
    adjustWeights() {
        if (this.feedbackHistory.length < 5) return; // Need minimum data

        const avgAccuracy = this.getOverallAccuracy();

        for (const [algoName, perf] of Object.entries(this.algorithmPerformance)) {
            if (perf.predictions < 3) continue; // Need minimum predictions

            const algo = this.predictionEngine.algorithms[algoName];
            if (!algo) continue;

            // Calculate recent performance (last 10-20 predictions)
            const recentPerf = perf.recentCorrect.length > 0
                ? (perf.recentCorrect.reduce((a, b) => a + b, 0) / perf.recentCorrect.length) * 100
                : perf.accuracy;

            // Adjust weight based on performance relative to average
            if (recentPerf > avgAccuracy * 1.2) {
                // High performer - increase weight
                algo.weight = Math.min(
                    this.maxWeight,
                    algo.weight + this.learningRate
                );
            } else if (recentPerf < avgAccuracy * 0.6) {
                // Low performer - decrease weight
                algo.weight = Math.max(
                    this.minWeight,
                    algo.weight - this.learningRate
                );
            } else {
                // Average performer - slight adjustment toward baseline
                const targetWeight = 1.0 + (recentPerf - avgAccuracy) / 100;
                algo.weight = algo.weight * 0.9 + targetWeight * 0.1;
            }

            // Ensure weights stay in bounds
            algo.weight = Math.max(this.minWeight, Math.min(this.maxWeight, algo.weight));
        }

        // Normalize weights to prevent runaway values
        this.normalizeWeights();
    }

    // Normalize weights so they sum to a reasonable total
    normalizeWeights() {
        const weights = Object.values(this.predictionEngine.algorithms).map(a => a.weight);
        const sum = weights.reduce((a, b) => a + b, 0);
        const avgWeight = sum / weights.length;
        const targetAvg = 1.0;

        // If average weight drifts too far from 1, normalize
        if (avgWeight > 1.5 || avgWeight < 0.5) {
            const scale = targetAvg / avgWeight;
            for (const algo of Object.values(this.predictionEngine.algorithms)) {
                algo.weight *= scale;
            }
        }
    }

    // Get overall accuracy
    getOverallAccuracy() {
        if (this.feedbackHistory.length === 0) return 50;

        const correct = this.feedbackHistory.filter(f => f.isCorrect).length;
        return (correct / this.feedbackHistory.length) * 100;
    }

    // Get recent accuracy (last N predictions)
    getRecentAccuracy(count = 10) {
        if (this.feedbackHistory.length === 0) return 50;

        const recent = this.feedbackHistory.slice(-count);
        const correct = recent.filter(f => f.isCorrect).length;
        return (correct / recent.length) * 100;
    }

    // Get detailed algorithm performance stats
    getAlgorithmStats() {
        const stats = [];

        for (const [algoName, algo] of Object.entries(this.predictionEngine.algorithms)) {
            const perf = this.algorithmPerformance[algoName];
            const recentAccuracy = perf.recentCorrect.length > 0
                ? (perf.recentCorrect.reduce((a, b) => a + b, 0) / perf.recentCorrect.length) * 100
                : 0;

            stats.push({
                name: algo.name,
                weight: algo.weight.toFixed(2),
                accuracy: perf.accuracy.toFixed(1),
                recentAccuracy: recentAccuracy.toFixed(1),
                predictions: perf.predictions,
                correct: perf.correct,
                incorrect: perf.incorrect
            });
        }

        // Sort by weight descending
        return stats.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
    }

    // Detect if the system is learning (accuracy improving)
    isLearning() {
        if (this.feedbackHistory.length < 20) return null;

        const firstHalf = this.feedbackHistory.slice(0, Math.floor(this.feedbackHistory.length / 2));
        const secondHalf = this.feedbackHistory.slice(Math.floor(this.feedbackHistory.length / 2));

        const firstAccuracy = (firstHalf.filter(f => f.isCorrect).length / firstHalf.length) * 100;
        const secondAccuracy = (secondHalf.filter(f => f.isCorrect).length / secondHalf.length) * 100;

        const improvement = secondAccuracy - firstAccuracy;

        return {
            isImproving: improvement > 5,
            improvement: improvement.toFixed(1),
            firstHalfAccuracy: firstAccuracy.toFixed(1),
            secondHalfAccuracy: secondAccuracy.toFixed(1)
        };
    }

    // Get learning insights
    getLearningInsights() {
        const insights = [];
        const overallAccuracy = this.getOverallAccuracy();
        const recentAccuracy = this.getRecentAccuracy();
        const learning = this.isLearning();

        if (this.feedbackHistory.length < 10) {
            insights.push({
                type: 'info',
                message: `Collecting data... ${this.feedbackHistory.length}/10 predictions needed for analysis.`
            });
        }

        if (overallAccuracy >= 80) {
            insights.push({
                type: 'success',
                message: `Excellent! Overall accuracy is ${overallAccuracy.toFixed(1)}%.`
            });
        } else if (overallAccuracy >= 60) {
            insights.push({
                type: 'warning',
                message: `Good progress. Accuracy: ${overallAccuracy.toFixed(1)}%. Keep providing feedback.`
            });
        }

        if (learning && learning.isImproving) {
            insights.push({
                type: 'success',
                message: `System is learning! Accuracy improved by ${learning.improvement}%.`
            });
        } else if (learning && !learning.isImproving) {
            insights.push({
                type: 'info',
                message: 'Accuracy stabilizing. May have reached optimal performance for this data.'
            });
        }

        if (recentAccuracy > overallAccuracy + 10) {
            insights.push({
                type: 'success',
                message: `Recent predictions performing better (+${(recentAccuracy - overallAccuracy).toFixed(1)}%).`
            });
        }

        // Algorithm recommendations
        const stats = this.getAlgorithmStats();
        const topAlgo = stats[0];
        if (topAlgo && topAlgo.predictions >= 5) {
            insights.push({
                type: 'info',
                message: `"${topAlgo.name}" is the top performing algorithm (${topAlgo.accuracy}% accurate).`
            });
        }

        return insights;
    }

    // Pattern-specific learning
    detectMetaPatterns() {
        if (this.feedbackHistory.length < 30) return null;

        const patterns = {
            timeOfDay: {},
            streaks: { current: 0, longest: 0 },
            confidence: { high: 0, lowCorrect: 0, highWrong: 0 }
        };

        let currentStreak = 0;
        let longestStreak = 0;

        this.feedbackHistory.forEach(feedback => {
            // Time-based patterns
            const hour = new Date(feedback.timestamp).getHours();
            const timeSlot = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
            if (!patterns.timeOfDay[timeSlot]) {
                patterns.timeOfDay[timeSlot] = { correct: 0, total: 0 };
            }
            patterns.timeOfDay[timeSlot].total++;
            if (feedback.isCorrect) {
                patterns.timeOfDay[timeSlot].correct++;
            }

            // Streak detection
            if (feedback.isCorrect) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }

            // Confidence correlation
            if (feedback.confidence > 70 && feedback.isCorrect) {
                patterns.confidence.high++;
            } else if (feedback.confidence < 50 && feedback.isCorrect) {
                patterns.confidence.lowCorrect++;
            } else if (feedback.confidence > 70 && !feedback.isCorrect) {
                patterns.confidence.highWrong++;
            }
        });

        patterns.streaks.current = currentStreak;
        patterns.streaks.longest = longestStreak;

        return patterns;
    }

    // Export learning data
    exportLearningData() {
        return {
            feedbackHistory: this.feedbackHistory,
            algorithmPerformance: this.algorithmPerformance,
            algorithmWeights: Object.fromEntries(
                Object.entries(this.predictionEngine.algorithms).map(([name, algo]) => [name, algo.weight])
            ),
            stats: {
                totalPredictions: this.feedbackHistory.length,
                overallAccuracy: this.getOverallAccuracy(),
                recentAccuracy: this.getRecentAccuracy()
            }
        };
    }

    // Import learning data
    importLearningData(data) {
        if (data.feedbackHistory) {
            this.feedbackHistory = data.feedbackHistory;
        }
        if (data.algorithmPerformance) {
            this.algorithmPerformance = data.algorithmPerformance;
        }
        if (data.algorithmWeights) {
            for (const [name, weight] of Object.entries(data.algorithmWeights)) {
                if (this.predictionEngine.algorithms[name]) {
                    this.predictionEngine.algorithms[name].weight = weight;
                }
            }
        }
    }

    // Clear all learning data
    clearLearningData() {
        this.feedbackHistory = [];
        this.algorithmPerformance = this.initializePerformance();

        // Reset all weights to 1.0
        for (const algo of Object.values(this.predictionEngine.algorithms)) {
            algo.weight = 1.0;
        }
    }

    // Automatically verify prediction when new actual number is added
    autoVerifyLastPrediction(lastPrediction, actualNumber) {
        if (!lastPrediction) return null;

        const isCorrect = lastPrediction.number === actualNumber;
        return this.recordFeedback(lastPrediction, actualNumber, isCorrect);
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningEngine;
}
