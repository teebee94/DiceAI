// =======================================
// Learning Engine
// Self-learning capabilities with feedback
// =======================================

class LearningEngine {
    constructor(predictionEngine) {
        this.predictionEngine = predictionEngine;
        this.feedbackHistory = [];
        this.algorithmPerformance = {};

        // Initialize performance tracking for each algorithm
        Object.keys(predictionEngine.algorithms).forEach(algoName => {
            this.algorithmPerformance[algoName] = {
                predictions: 0,
                correct: 0,
                accuracy: 50
            };
        });
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
                this.updateAlgorithmPerformance(algoName, isCorrect);
            });
        }

        // Adjust weights periodically
        if (this.feedbackHistory.length % 10 === 0) {
            this.adjustWeights();
        }

        // Update prediction engine performance tracking
        this.predictionEngine.recordPredictionOutcome?.(prediction, actualNumber, isCorrect);
    }

    // Update performance for a specific algorithm
    updateAlgorithmPerformance(algoName, isCorrect) {
        if (!this.algorithmPerformance[algoName]) return;

        this.algorithmPerformance[algoName].predictions++;
        if (isCorrect) {
            this.algorithmPerformance[algoName].correct++;
        }

        const perf = this.algorithmPerformance[algoName];
        perf.accuracy = perf.predictions > 0
            ? (perf.correct / perf.predictions) * 100
            : 50;
    }

    // Adjust algorithm weights based on performance
    adjustWeights() {
        Object.keys(this.algorithmPerformance).forEach(algoName => {
            const perf = this.algorithmPerformance[algoName];

            if (perf.predictions >= 5) {
                const accuracy = perf.accuracy / 100;
                const currentWeight = this.predictionEngine.algorithms[algoName]?.weight || 1.0;

                // Adjust weight based on accuracy
                let newWeight = currentWeight;
                if (accuracy > 0.6) {
                    newWeight *= 1.1; // Increase weight for good performance
                } else if (accuracy < 0.4) {
                    newWeight *= 0.9; // Decrease weight for poor performance
                }

                // Cap weights between 0.5 and 2.0
                newWeight = Math.max(0.5, Math.min(2.0, newWeight));

                if (this.predictionEngine.algorithms[algoName]) {
                    this.predictionEngine.algorithms[algoName].weight = newWeight;
                }
            }
        });
    }

    // Get overall accuracy
    getOverallAccuracy() {
        if (this.feedbackHistory.length === 0) return 0;

        const correct = this.feedbackHistory.filter(f => f.isCorrect).length;
        return (correct / this.feedbackHistory.length) * 100;
    }

    // Get learning insights
    getLearningInsights() {
        const insights = [];

        if (this.feedbackHistory.length === 0) {
            return insights;
        }

        const overall = this.getOverallAccuracy();

        if (overall >= 70) {
            insights.push({
                type: 'success',
                message: `🎯 Excellent! ${overall.toFixed(1)}% prediction accuracy`
            });
        } else if (overall >= 50) {
            insights.push({
                type: 'info',
                message: `📊 System learning: ${overall.toFixed(1)}% accuracy`
            });
        } else {
            insights.push({
                type: 'warning',
                message: `🔄 Building pattern database: ${overall.toFixed(1)}% accuracy`
            });
        }

        // Recent trend
        const recent = this.feedbackHistory.slice(-10);
        if (recent.length >= 10) {
            const recentCorrect = recent.filter(f => f.isCorrect).length;
            const recentAccuracy = (recentCorrect / recent.length) * 100;

            if (recentAccuracy > overall + 10) {
                insights.push({
                    type: 'success',
                    message: '📈 Performance improving! Recent accuracy: ' + recentAccuracy.toFixed(1) + '%'
                });
            } else if (recentAccuracy < overall - 10) {
                insights.push({
                    type: 'warning',
                    message: '📉 Adapting to new patterns...'
                });
            }
        }

        // Learning progress
        if (this.feedbackHistory.length >= 20) {
            insights.push({
                type: 'info',
                message: `🧠 ${this.feedbackHistory.length} predictions analyzed`
            });
        }

        return insights;
    }

    // Get algorithm statistics
    getAlgorithmStats() {
        const stats = [];

        Object.entries(this.algorithmPerformance).forEach(([name, perf]) => {
            if (perf.predictions > 0) {
                stats.push({
                    name: this.predictionEngine.algorithms[name]?.name || name,
                    accuracy: perf.accuracy.toFixed(1),
                    predictions: perf.predictions,
                    correct: perf.correct
                });
            }
        });

        return stats.sort((a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy));
    }

    // Export learning data
    exportLearningData() {
        return {
            feedbackHistory: this.feedbackHistory,
            algorithmPerformance: this.algorithmPerformance,
            weights: Object.keys(this.predictionEngine.algorithms).reduce((acc, key) => {
                acc[key] = this.predictionEngine.algorithms[key].weight;
                return acc;
            }, {})
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
        if (data.weights) {
            Object.entries(data.weights).forEach(([key, weight]) => {
                if (this.predictionEngine.algorithms[key]) {
                    this.predictionEngine.algorithms[key].weight = weight;
                }
            });
        }
    }

    // Clear learning data
    clearLearningData() {
        this.feedbackHistory = [];
        Object.keys(this.algorithmPerformance).forEach(key => {
            this.algorithmPerformance[key] = {
                predictions: 0,
                correct: 0,
                accuracy: 50
            };
        });
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningEngine;
}
