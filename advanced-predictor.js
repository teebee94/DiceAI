// =======================================
// Advanced Predictor
// Get top 3 predictions & algorithm insights
// =======================================

class AdvancedPredictor {
    constructor(predictionEngine) {
        this.engine = predictionEngine;
    }

    // Get next 3 best predictions with confidence scores
    getNext3Predictions() {
        const allNumbers = Array.from({ length: 16 }, (_, i) => i + 3); // 3-18
        const predictions = [];

        // Get prediction for each possible number
        allNumbers.forEach(number => {
            const confidence = this.estimateConfidence(number);
            const risk = this.calculateRisk(number, confidence);

            predictions.push({
                number,
                confidence: Math.round(confidence),
                risk,
                isBig: number >= 11,
                isEven: number % 2 === 0,
                reasoning: this.getReasoningForNumber(number)
            });
        });

        // Sort by confidence and return top 3
        return predictions
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3)
            .map((p, index) => ({
                ...p,
                rank: index + 1,
                label: index === 0 ? 'Most Likely' : index === 1 ? 'Alternative' : 'Backup'
            }));
    }

    // Estimate confidence for a specific number
    estimateConfidence(number) {
        if (!this.engine.history || this.engine.history.length === 0) {
            return 50; // Base confidence with no data
        }

        let score = 50;
        const recent = this.engine.history.slice(-20);

        // Frequency analysis
        const frequency = recent.filter(n => n === number).length;
        if (frequency > 3) score += 10;
        else if (frequency > 1) score += 5;

        // Pattern matching
        if (this.matchesRecentPattern(number)) score += 15;

        // Hot/cold analysis
        const lastOccurrence = this.engine.history.lastIndexOf(number);
        const recency = this.engine.history.length - lastOccurrence;
        if (recency < 5) score += 10;
        else if (recency > 20) score -= 10;

        // Big/Small pattern
        const isBig = number >= 11;
        const recentBig = recent.filter(n => n >= 11).length;
        if ((isBig && recentBig > 10) || (!isBig && recentBig < 10)) {
            score += 5;
        }

        return Math.max(30, Math.min(95, score));
    }

    // Calculate risk level (1-10, lower = safer)
    calculateRisk(number, confidence) {
        // Higher confidence = lower risk
        let risk = Math.round((100 - confidence) / 10);

        // Extreme numbers (3, 4, 17, 18) are riskier
        if (number <= 4 || number >= 17) risk = Math.min(10, risk + 2);

        // Middle numbers (10-11) are safer
        if (number >= 10 && number <= 11) risk = Math.max(1, risk - 1);

        return Math.max(1, Math.min(10, risk));
    }

    // Check if number matches recent patterns
    matchesRecentPattern(number) {
        const recent = this.engine.history.slice(-5);
        if (recent.length < 3) return false;

        // Check for number that appears in similar sequences
        const isBig = number >= 11;
        const isEven = number % 2 === 0;

        const recentBig = recent[recent.length - 1] >= 11;
        const recentEven = recent[recent.length - 1] % 2 === 0;

        return (isBig === recentBig) && (isEven === recentEven);
    }

    // Get reasoning for why this number was predicted
    getReasoningForNumber(number) {
        const reasons = [];
        const recent = this.engine.history.slice(-20);

        if (recent.length === 0) {
            return 'Insufficient data for analysis';
        }

        // Frequency
        const freq = recent.filter(n => n === number).length;
        if (freq > 3) reasons.push(`Appeared ${freq} times recently`);
        else if (freq === 0) reasons.push('Due for appearance');

        // Pattern
        const isBig = number >= 11;
        const recentBig = recent.filter(n => n >= 11).length;
        if (isBig && recentBig > 10) reasons.push('Big numbers trending');
        else if (!isBig && recentBig < 10) reasons.push('Small numbers trending');

        // Position
        if (number >= 10 && number <= 11) reasons.push('Statistically most common');

        return reasons.join(', ') || 'Based on algorithm consensus';
    }

    // Compare all 16 algorithms side-by-side
    compareAllAlgorithms() {
        const algorithms = [
            'frequency', 'hotCold', 'pattern', 'sequential', 'gap', 'pairs',
            'bigSmall', 'oddEven', 'sum', 'range', 'cluster', 'zigzag',
            'momentum', 'reversal', 'average', 'weighted'
        ];

        const comparisons = algorithms.map(algo => {
            const prediction = this.simulateAlgorithm(algo);
            return {
                algorithm: algo,
                prediction: prediction.number,
                confidence: prediction.confidence,
                description: this.getAlgorithmDescription(algo)
            };
        });

        return comparisons.sort((a, b) => b.confidence - a.confidence);
    }

    // Simulate what each algorithm would predict
    simulateAlgorithm(algo) {
        // Simplified simulation - in real app, would call actual algorithm
        const baseNumber = this.engine.getPrediction().number;
        const variance = Math.floor(Math.random() * 3) - 1;
        const number = Math.max(3, Math.min(18, baseNumber + variance));

        return {
            number,
            confidence: 50 + Math.floor(Math.random() * 30)
        };
    }

    // Get algorithm description
    getAlgorithmDescription(algo) {
        const descriptions = {
            frequency: 'Most common numbers',
            hotCold: 'Hot vs cold analysis',
            pattern: 'Pattern recognition',
            sequential: 'Sequential trends',
            gap: 'Gap analysis',
            pairs: 'Number pairs',
            bigSmall: 'Big/Small patterns',
            oddEven: 'Odd/Even patterns',
            sum: 'Sum analysis',
            range: 'Range prediction',
            cluster: 'Cluster detection',
            zigzag: 'Zigzag patterns',
            momentum: 'Momentum indicator',
            reversal: 'Reversal detection',
            average: 'Moving average',
            weighted: 'Weighted analysis'
        };

        return descriptions[algo] || 'Unknown algorithm';
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPredictor;
}
