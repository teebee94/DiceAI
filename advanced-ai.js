// =======================================
// Advanced AI Features
// Prediction explanations and analysis
// =======================================

class AdvancedAI {
    constructor(predictionEngine, aiInsights) {
        this.predictionEngine = predictionEngine;
        this.aiInsights = aiInsights;
    }

    // Generate detailed explanation for prediction
    explainPrediction(prediction) {
        if (!prediction || prediction.belowThreshold) {
            return {
                summary: 'No prediction available',
                details: [],
                confidence: 0
            };
        }

        const explanation = {
            summary: this.generateSummary(prediction),
            details: this.generateDetails(prediction),
            confidence: prediction.confidence,
            reasoning: this.generateReasoning(prediction)
        };

        return explanation;
    }

    // Generate summary text
    generateSummary(prediction) {
        const confidenceLevel = this.getConfidenceLevel(prediction.confidence);
        const type = prediction.isBig ? 'BIG (11-18)' : 'SMALL (3-10)';
        const parity = prediction.isEven ? 'EVEN' : 'ODD';

        return `AI predicts ${prediction.number} (${type}, ${parity}) with ${confidenceLevel} confidence (${prediction.confidence}%)`;
    }

    // Generate detailed breakdown
    generateDetails(prediction) {
        const details = [];

        // Algorithm consensus
        if (prediction.contributors) {
            details.push({
                icon: '🤖',
                title: 'Algorithm Consensus',
                text: `${prediction.contributors.length} algorithms agree on this prediction`,
                items: prediction.contributors.slice(0, 5).map(algo =>
                    this.predictionEngine.algorithms[algo]?.name || algo
                )
            });
        }

        // Pattern analysis
        const patterns = this.analyzePatterns(prediction.number);
        if (patterns.length > 0) {
            details.push({
                icon: '📊',
                title: 'Pattern Analysis',
                text: 'Detected patterns supporting this prediction',
                items: patterns
            });
        }

        // Historical context
        const context = this.getHistoricalContext(prediction.number);
        if (context) {
            details.push({
                icon: '📈',
                title: 'Historical Context',
                text: context
            });
        }

        // Confidence factors
        details.push({
            icon: '🎯',
            title: 'Confidence Factors',
            text: this.getConfidenceFactors(prediction)
        });

        return details;
    }

    // Analyze patterns for predicted number
    analyzePatterns(number) {
        const patterns = [];
        const history = this.predictionEngine.history.slice(-10);

        if (history.length === 0) return patterns;

        // Check recent frequency
        const recentCount = history.filter(h => h.number === number).length;
        if (recentCount > 2) {
            patterns.push(`Number ${number} appeared ${recentCount} times in last 10 rolls`);
        }

        // Check if it's currently hot
        const heatmap = this.predictionEngine.getHeatmapData();
        if (heatmap[number]?.level === 'hot') {
            patterns.push(`Currently a hot number (${heatmap[number].percentage.toFixed(1)}% frequency)`);
        }

        // Check gap analysis
        const lastIndex = history.map(h => h.number).lastIndexOf(number);
        if (lastIndex >= 0) {
            const gap = history.length - lastIndex - 1;
            if (gap >= 5) {
                patterns.push(`Last appeared ${gap} rolls ago - overdue probability increasing`);
            }
        }

        return patterns;
    }

    // Get historical context
    getHistoricalContext(number) {
        const metadata = this.predictionEngine.metadata || [];
        const history = this.predictionEngine.history;

        if (history.length < 10) return null;

        const totalCount = history.filter(h => h.number === number).length;
        const percentage = (totalCount / history.length) * 100;

        return `Number ${number} has appeared ${totalCount} times (${percentage.toFixed(1)}% of ${history.length} total rolls)`;
    }

    // Get confidence factors
    getConfidenceFactors(prediction) {
        const factors = [];

        if (prediction.confidence >= 70) {
            factors.push('✓ Strong algorithm agreement');
        }
        if (prediction.contributors && prediction.contributors.length >= 8) {
            factors.push('✓ Multiple algorithm support');
        }

        const history = this.predictionEngine.history;
        if (history.length >= 50) {
            factors.push('✓ Sufficient historical data');
        } else if (history.length >= 20) {
            factors.push('○ Moderate historical data');
        } else {
            factors.push('⚠ Limited historical data');
        }

        return factors.join(' • ');
    }

    // Generate reasoning
    generateReasoning(prediction) {
        const reasoning = [];

        if (prediction.confidence >= 75) {
            reasoning.push('🎯 **High Confidence**: Multiple advanced algorithms strongly agree on this prediction.');
        } else if (prediction.confidence >= 60) {
            reasoning.push('⚖️ **Good Confidence**: Algorithms show reliable consensus with supporting patterns.');
        } else {
            reasoning.push('⚠️ **Moderate Confidence**: Some algorithmic agreement but with mixed signals.');
        }

        // Add specific algorithm insights
        if (prediction.contributors) {
            const hasMarkov = prediction.contributors.includes('markov');
            const hasBayesian = prediction.contributors.includes('bayesian');
            const hasFrequency = prediction.contributors.includes('frequency');

            if (hasMarkov && hasBayesian) {
                reasoning.push('🧠 Both Markov Chain and Bayesian probability models support this prediction, indicating strong statistical backing.');
            } else if (hasFrequency) {
                reasoning.push('📊 Frequency analysis shows this number is statistically likely based on recent patterns.');
            }
        }

        return reasoning;
    }

    // Get confidence level description
    getConfidenceLevel(confidence) {
        if (confidence >= 80) return 'Very High';
        if (confidence >= 70) return 'High';
        if (confidence >= 60) return 'Good';
        if (confidence >= 50) return 'Moderate';
        return 'Low';
    }

    // Create visual explanation card
    createExplanationCard(prediction) {
        const explanation = this.explainPrediction(prediction);

        const card = document.createElement('div');
        card.className = 'explanation-card';
        card.style.cssText = 'margin-top: var(--space-md); padding: var(--space-lg); background: var(--color-bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--color-border);';

        // Summary
        const summary = document.createElement('div');
        summary.style.cssText = 'font-size: var(--font-size-lg); font-weight: 600; color: var(--color-text); margin-bottom: var(--space-md);';
        summary.innerHTML = `<span style="font-size: 2rem; margin-right: var(--space-sm);">🤖</span>${explanation.summary}`;
        card.appendChild(summary);

        // Details
        explanation.details.forEach(detail => {
            const section = document.createElement('div');
            section.style.cssText = 'margin-top: var(--space-lg); padding: var(--space-md); background: var(--color-bg-tertiary); border-radius: var(--radius-sm);';

            const header = document.createElement('div');
            header.style.cssText = 'font-weight: 600; color: var(--color-text); margin-bottom: var(--space-sm);';
            header.innerHTML = `${detail.icon} ${detail.title}`;
            section.appendChild(header);

            const text = document.createElement('div');
            text.style.cssText = 'color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-sm);';
            text.textContent = detail.text;
            section.appendChild(text);

            if (detail.items) {
                const list = document.createElement('ul');
                list.style.cssText = 'margin: 0; padding-left: var(--space-lg); color: var(--color-text-tertiary); font-size: var(--font-size-sm);';
                detail.items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    list.appendChild(li);
                });
                section.appendChild(list);
            }

            card.appendChild(section);
        });

        // Reasoning
        if (explanation.reasoning) {
            const reasoning = document.createElement('div');
            reasoning.style.cssText = 'margin-top: var(--space-lg); padding: var(--space-md); background: rgba(99, 102, 241, 0.1); border-left: 3px solid var(--color-primary); border-radius: var(--radius-sm);';
            reasoning.innerHTML = explanation.reasoning.map(r => `<p style="margin: var(--space-xs) 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">${r}</p>`).join('');
            card.appendChild(reasoning);
        }

        return card;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAI;
}
