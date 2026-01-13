// =======================================
// AI Insights & Analysis
// Smart pattern explanations and suggestions
// =======================================

class AIInsights {
    constructor(predictionEngine, learningEngine) {
        this.predictionEngine = predictionEngine;
        this.learningEngine = learningEngine;
    }

    // Generate AI-powered insights about current patterns
    generateInsights() {
        const insights = [];
        const stats = this.predictionEngine.getStatistics();
        const history = this.predictionEngine.history;

        if (history.length < 5) {
            return [{
                type: 'info',
                icon: '🤖',
                title: 'Building Intelligence',
                message: 'Add more data to unlock AI insights and pattern analysis.'
            }];
        }

        // Analyze Big/Small patterns
        const bigSmallInsight = this.analyzeBigSmallPattern();
        if (bigSmallInsight) insights.push(bigSmallInsight);

        // Analyze Even/Odd patterns
        const evenOddInsight = this.analyzeEvenOddPattern();
        if (evenOddInsight) insights.push(evenOddInsight);

        // Analyze streaks
        const streakInsight = this.analyzeStreaks();
        if (streakInsight) insights.push(streakInsight);

        // Analyze hot numbers
        const hotNumberInsight = this.analyzeHotNumbers();
        if (hotNumberInsight) insights.push(hotNumberInsight);

        // Strategy suggestions
        const strategySuggestion = this.suggestStrategy();
        if (strategySuggestion) insights.push(strategySuggestion);

        // Learning progress
        const learningInsight = this.analyzeLearningProgress();
        if (learningInsight) insights.push(learningInsight);

        return insights;
    }

    // Analyze Big/Small pattern
    analyzeBigSmallPattern() {
        const recent = this.predictionEngine.history.slice(-10);
        if (recent.length < 10) return null;

        const bigCount = recent.filter(r => r.isBig).length;
        const ratio = bigCount / recent.length;

        if (ratio >= 0.7) {
            return {
                type: 'warning',
                icon: '🔴',
                title: 'Big Number Dominance',
                message: `${bigCount}/10 recent rolls are BIG (11-18). Pattern suggests potential shift to SMALL soon.`,
                confidence: Math.round(ratio * 100)
            };
        } else if (ratio <= 0.3) {
            return {
                type: 'success',
                icon: '🟢',
                title: 'Small Number Dominance',
                message: `${10 - bigCount}/10 recent rolls are SMALL (3-10). Pattern suggests potential shift to BIG soon.`,
                confidence: Math.round((1 - ratio) * 100)
            };
        }

        return null;
    }

    // Analyze Even/Odd pattern
    analyzeEvenOddPattern() {
        const recent = this.predictionEngine.history.slice(-10);
        if (recent.length < 10) return null;

        const evenCount = recent.filter(r => r.isEven).length;
        const ratio = evenCount / recent.length;

        if (ratio >= 0.7) {
            return {
                type: 'info',
                icon: '🔵',
                title: 'Even Number Trend',
                message: `${evenCount}/10 recent rolls are EVEN. Odd numbers may appear soon to balance.`,
                confidence: Math.round(ratio * 100)
            };
        } else if (ratio <= 0.3) {
            return {
                type: 'info',
                icon: '🟡',
                title: 'Odd Number Trend',
                message: `${10 - evenCount}/10 recent rolls are ODD. Even numbers may appear soon to balance.`,
                confidence: Math.round((1 - ratio) * 100)
            };
        }

        return null;
    }

    // Analyze streaks
    analyzeStreaks() {
        const recent = this.predictionEngine.history.slice(-5);
        if (recent.length < 5) return null;

        // Check for number streaks
        const uniqueNumbers = new Set(recent.map(r => r.number));
        if (uniqueNumbers.size === 1) {
            return {
                type: 'warning',
                icon: '🔥',
                title: 'Extreme Streak Detected!',
                message: `Number ${recent[0].number} appeared 5 times in a row! Statistical anomaly - expect change.`,
                confidence: 95
            };
        }

        // Check for Big/Small streaks
        const allBig = recent.every(r => r.isBig);
        const allSmall = recent.every(r => !r.isBig);

        if (allBig) {
            return {
                type: 'warning',
                icon: '🎯',
                title: 'BIG Streak Active',
                message: '5 consecutive BIG rolls. Strong pattern - but streaks end. Consider SMALL soon.',
                confidence: 85
            };
        } else if (allSmall) {
            return {
                type: 'success',
                icon: '🎯',
                title: 'SMALL Streak Active',
                message: '5 consecutive SMALL rolls. Strong pattern - but streaks end. Consider BIG soon.',
                confidence: 85
            };
        }

        return null;
    }

    // Analyze hot numbers
    analyzeHotNumbers() {
        const heatmap = this.predictionEngine.getHeatmapData();
        const hotNumbers = Object.entries(heatmap)
            .filter(([num, data]) => data.level === 'hot')
            .map(([num]) => parseInt(num))
            .sort((a, b) => heatmap[b].percentage - heatmap[a].percentage)
            .slice(0, 3);

        if (hotNumbers.length > 0) {
            return {
                type: 'info',
                icon: '🔥',
                title: 'Hot Number Alert',
                message: `Numbers ${hotNumbers.join(', ')} are appearing frequently. AI suggests focusing on or avoiding these.`,
                confidence: 75
            };
        }

        return null;
    }

    // Suggest betting strategy
    suggestStrategy() {
        const stats = this.predictionEngine.getStatistics();
        const accuracy = this.learningEngine.getOverallAccuracy();

        if (accuracy >= 70) {
            return {
                type: 'success',
                icon: '💎',
                title: 'AI Strategy: Aggressive',
                message: `${accuracy.toFixed(1)}% accuracy! System is confident. Recommended: Trust predictions with competitive mode at 65%+.`,
                confidence: Math.round(accuracy)
            };
        } else if (accuracy >= 50) {
            return {
                type: 'info',
                icon: '⚖️',
                title: 'AI Strategy: Balanced',
                message: `${accuracy.toFixed(1)}% accuracy. System learning. Recommended: Use predictions cautiously, verify patterns manually.`,
                confidence: Math.round(accuracy)
            };
        } else if (stats.total >= 20) {
            return {
                type: 'warning',
                icon: '🎓',
                title: 'AI Strategy: Learning Mode',
                message: `${accuracy.toFixed(1)}% accuracy. System still learning patterns. Recommended: Gather more data, provide consistent feedback.`,
                confidence: Math.round(accuracy)
            };
        }

        return null;
    }

    // Analyze learning progress
    analyzeLearningProgress() {
        const feedbackCount = this.learningEngine.feedbackHistory.length;

        if (feedbackCount >= 50) {
            const recent = this.learningEngine.feedbackHistory.slice(-20);
            const recentCorrect = recent.filter(f => f.isCorrect).length;
            const recentAccuracy = (recentCorrect / recent.length) * 100;

            if (recentAccuracy > 60) {
                return {
                    type: 'success',
                    icon: '🧠',
                    title: 'AI Learning: Advanced',
                    message: `Recent accuracy ${recentAccuracy.toFixed(1)}%. Neural patterns strengthening. System achieving peak performance.`,
                    confidence: Math.round(recentAccuracy)
                };
            }
        } else if (feedbackCount >= 20) {
            return {
                type: 'info',
                icon: '📊',
                title: 'AI Learning: Improving',
                message: `${feedbackCount} feedback entries processed. AI adapting to your game's unique patterns.`,
                confidence: 60
            };
        }

        return null;
    }

    // Get prediction explanation
    explainPrediction(prediction) {
        if (!prediction || !prediction.contributors) {
            return 'Generate a prediction to see AI analysis.';
        }

        const topAlgorithms = prediction.contributors.slice(0, 3);
        const explanation = [];

        explanation.push(`🤖 **AI Analysis for ${prediction.number}:**\n`);
        explanation.push(`Confidence: ${prediction.confidence}% (${this.getConfidenceLevel(prediction.confidence)})\n`);
        explanation.push(`\n**Top Contributing Algorithms:**`);

        topAlgorithms.forEach((algo, idx) => {
            const name = this.predictionEngine.algorithms[algo]?.name || algo;
            explanation.push(`${idx + 1}. ${name}`);
        });

        explanation.push(`\n**Classification:**`);
        explanation.push(`• Type: ${prediction.isBig ? 'BIG (11-18)' : 'SMALL (3-10)'}`);
        explanation.push(`• Parity: ${prediction.isEven ? 'EVEN' : 'ODD'}`);

        if (prediction.confidence >= 70) {
            explanation.push(`\n✅ **Strong Signal** - Multiple algorithms agree on this prediction.`);
        } else if (prediction.confidence >= 55) {
            explanation.push(`\n⚖️ **Moderate Signal** - Algorithms show consensus but with some variation.`);
        } else {
            explanation.push(`\n⚠️ **Weak Signal** - Conflicting patterns detected. Use caution.`);
        }

        return explanation.join('\n');
    }

    getConfidenceLevel(confidence) {
        if (confidence >= 80) return '💎 Very High';
        if (confidence >= 70) return '🔥 High';
        if (confidence >= 60) return '✅ Good';
        if (confidence >= 50) return '⚖️ Moderate';
        return '⚠️ Low';
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIInsights;
}
