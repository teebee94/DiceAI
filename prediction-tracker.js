// =======================================
// Prediction Tracker
// Track prediction performance over time
// =======================================

class PredictionTracker {
    constructor(app) {
        this.app = app;
        this.predictions = []; // History of all predictions
    }

    // Record a new prediction
    recordPrediction(prediction) {
        const record = {
            timestamp: Date.now(),
            predictedNumber: prediction.number,
            confidence: prediction.confidence,
            algorithms: prediction.algorithmVotes || {},
            topAlgorithms: prediction.topAlgorithms || [],
            period: this.app.currentData.lastPeriod,
            actualNumber: null,
            wasCorrect: null,
            feedback: null
        };

        this.predictions.push(record);
        this.saveToStorage();

        return record;
    }

    // Update prediction with actual result
    updatePredictionResult(index, actualNumber, wasCorrect) {
        if (this.predictions[index]) {
            this.predictions[index].actualNumber = actualNumber;
            this.predictions[index].wasCorrect = wasCorrect;
            this.predictions[index].feedback = Date.now();
            this.saveToStorage();
        }
    }

    // Get the last prediction
    getLastPrediction() {
        return this.predictions[this.predictions.length - 1];
    }

    // Get predictions with confidence >= threshold
    getHighConfidencePredictions(threshold = 65) {
        return this.predictions.filter(p => p.confidence >= threshold);
    }

    // Calculate accuracy by confidence level
    getAccuracyByConfidence() {
        const ranges = {
            '90-100%': { total: 0, correct: 0 },
            '80-89%': { total: 0, correct: 0 },
            '70-79%': { total: 0, correct: 0 },
            '60-69%': { total: 0, correct: 0 },
            '50-59%': { total: 0, correct: 0 }
        };

        this.predictions.forEach(p => {
            if (p.wasCorrect === null) return;

            let range;
            if (p.confidence >= 90) range = '90-100%';
            else if (p.confidence >= 80) range = '80-89%';
            else if (p.confidence >= 70) range = '70-79%';
            else if (p.confidence >= 60) range = '60-69%';
            else if (p.confidence >= 50) range = '50-59%';
            else return;

            ranges[range].total++;
            if (p.wasCorrect) ranges[range].correct++;
        });

        // Calculate percentages
        Object.keys(ranges).forEach(range => {
            const data = ranges[range];
            data.accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        });

        return ranges;
    }

    // Get prediction trends
    getTrends(windowSize = 10) {
        if (this.predictions.length < windowSize) return null;

        const recent = this.predictions.slice(-windowSize);
        const withResults = recent.filter(p => p.wasCorrect !== null);

        if (withResults.length === 0) return null;

        const avgConfidence = withResults.reduce((sum, p) => sum + p.confidence, 0) / withResults.length;
        const accuracy = withResults.filter(p => p.wasCorrect).length / withResults.length;

        return {
            predictions: windowSize,
            avgConfidence: Math.round(avgConfidence),
            accuracy: Math.round(accuracy * 100),
            improving: this.isImproving(withResults)
        };
    }

    // Check if predictions are improving
    isImproving(predictions) {
        const mid = Math.floor(predictions.length / 2);
        const firstHalf = predictions.slice(0, mid);
        const secondHalf = predictions.slice(mid);

        const firstAccuracy = firstHalf.filter(p => p.wasCorrect).length / firstHalf.length;
        const secondAccuracy = secondHalf.filter(p => p.wasCorrect).length / secondHalf.length;

        return secondAccuracy > firstAccuracy;
    }

    // Get most successful algorithms
    getBestAlgorithms() {
        const algorithmStats = {};

        this.predictions.forEach(p => {
            if (p.wasCorrect === null || !p.topAlgorithms) return;

            p.topAlgorithms.forEach(algo => {
                if (!algorithmStats[algo]) {
                    algorithmStats[algo] = { used: 0, correct: 0 };
                }
                algorithmStats[algo].used++;
                if (p.wasCorrect) algorithmStats[algo].correct++;
            });
        });

        return Object.entries(algorithmStats)
            .map(([algo, stats]) => ({
                algorithm: algo,
                accuracy: stats.used > 0 ? Math.round((stats.correct / stats.used) * 100) : 0,
                timesUsed: stats.used
            }))
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, 5);
    }

    // Save to localStorage
    saveToStorage() {
        localStorage.setItem('predictionTracker', JSON.stringify(this.predictions));
    }

    // Load from localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('predictionTracker');
        if (saved) {
            this.predictions = JSON.parse(saved);
        }
    }

    // Clear all predictions
    clear() {
        this.predictions = [];
        localStorage.removeItem('predictionTracker');
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PredictionTracker;
}
