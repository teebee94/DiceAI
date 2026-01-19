// =======================================
// Dice Prediction Engine
// Advanced Pattern Recognition & Analysis
// =======================================

class PredictionEngine {
    constructor() {
        this.history = [];
        this.metadata = []; // Store enhanced entries with period, dice, etc.

        this.algorithms = {
            // Standard algorithms
            frequency: { weight: 1.0, name: 'Frequency Analysis' },
            hotCold: { weight: 1.0, name: 'Hot/Cold Numbers' },
            trend: { weight: 1.0, name: 'Trend Detection' },
            sequence: { weight: 1.0, name: 'Sequence Pattern' },
            cycle: { weight: 1.0, name: 'Cycle Detection' },
            bigSmallMomentum: { weight: 1.0, name: 'Big/Small Momentum' },
            evenOddPattern: { weight: 1.0, name: 'Even/Odd Pattern' },
            gap: { weight: 1.0, name: 'Gap Analysis' },

            // Time-based algorithms (higher weight)
            timeOfDay: { weight: 1.2, name: 'Time of Day Pattern' },
            hourlyPattern: { weight: 1.1, name: 'Hourly Pattern' },
            timeWindow: { weight: 1.15, name: 'Time Window Analysis' },

            // Advanced AI algorithms (competitive edge)
            markovChain: { weight: 1.3, name: 'Markov Chain Transitions' },
            bayesianEngine: { weight: 1.35, name: 'Bayesian Probability' },
            streakMomentum: { weight: 1.2, name: 'Streak & Momentum' },
            diceCorrelation: { weight: 1.25, name: 'Dice Correlation' },
            multiLevel: { weight: 1.15, name: 'Multi-Level Patterns' },
            diceCorrelation: { weight: 1.25, name: 'Dice Correlation' },
            multiLevel: { weight: 1.15, name: 'Multi-Level Patterns' },
            streakAdaptation: { weight: 1.4, name: 'Streak Adaptation' },
            dayPattern: { weight: 1.1, name: 'Day of Week Pattern' } // New date-aware algo
        };

        // Performance tracking
        this.performance = {};
        Object.keys(this.algorithms).forEach(key => {
            this.performance[key] = {
                predictions: 0,
                correct: 0,
                accuracy: 0.5
            };
        });

        // Competitive mode
        this.competitiveMode = false;
        this.confidenceThreshold = 0.55;
        this.streakWeight = 0.0; // Dynamic weight based on recent success
    }

    // Add a roll to history
    addRoll(number, timestamp = Date.now()) {
        const date = new Date(timestamp);

        this.history.push({
            number,
            timestamp,
            isBig: number >= 11,
            isEven: number % 2 === 0,
            dateMetadata: {
                year: date.getFullYear(),
                month: date.getMonth(),      // 0-11
                day: date.getDate(),         // 1-31
                weekDay: date.getDay(),      // 0-6 (Sun-Sat)
                hour: date.getHours(),       // 0-23
                minute: date.getMinutes()
            }
        });
    }

    // Get prediction with confidence score
    getPrediction() {
        if (this.history.length < 5) {
            return this.getRandomPrediction();
        }

        const predictions = {};
        const algorithmResults = {};

        // Run all algorithms
        algorithmResults.frequency = this.frequencyAnalysis();
        algorithmResults.hotCold = this.hotColdAnalysis();
        algorithmResults.trend = this.trendAnalysis();
        algorithmResults.sequence = this.sequenceDetection();
        algorithmResults.cycle = this.cycleDetection();
        algorithmResults.bigSmallMomentum = this.bigSmallMomentumAnalysis();
        algorithmResults.evenOddPattern = this.evenOddPatternAnalysis();
        algorithmResults.gap = this.gapAnalysis();
        algorithmResults.timeOfDay = this.timeOfDayAnalysis();
        algorithmResults.hourlyPattern = this.hourlyPatternAnalysis();
        algorithmResults.timeWindow = this.timeWindowAnalysis();
        algorithmResults.markovChain = this.markovChainAnalysis();
        algorithmResults.bayesianEngine = this.bayesianProbabilityEngine();
        algorithmResults.streakMomentum = this.streakMomentumAnalysis();
        algorithmResults.diceCorrelation = this.diceCorrelationAnalysis();
        algorithmResults.multiLevel = this.multiLevelPatternRecognition();
        algorithmResults.multiLevel = this.multiLevelPatternRecognition();
        algorithmResults.streakAdaptation = this.streakAdaptation();
        algorithmResults.dayPattern = this.dayPatternAnalysis();

        // Weighted voting system
        for (const [algoName, result] of Object.entries(algorithmResults)) {
            if (result && result.predictions) {
                const weight = this.algorithms[algoName].weight;
                result.predictions.forEach(pred => {
                    if (!predictions[pred.number]) {
                        predictions[pred.number] = { score: 0, contributors: [] };
                    }
                    predictions[pred.number].score += pred.confidence * weight;
                    predictions[pred.number].contributors.push(algoName);
                });
            }
        }

        // Find best prediction
        let bestNumber = null;
        let bestScore = 0;
        for (const [number, data] of Object.entries(predictions)) {
            if (data.score > bestScore) {
                bestScore = data.score;
                bestNumber = parseInt(number);
            }
        }

        if (!bestNumber) {
            return this.getRandomPrediction();
        }

        // Calculate confidence (0-100)
        const totalWeight = Object.values(this.algorithms).reduce((sum, a) => sum + a.weight, 0);
        const maxPossibleScore = totalWeight * 1.0;
        const confidence = Math.min(100, (bestScore / maxPossibleScore) * 100);

        // Competitive mode: Only return prediction if confidence meets threshold
        if (this.competitiveMode && confidence < (this.confidenceThreshold * 100)) {
            return {
                number: null,
                confidence: Math.round(confidence),
                message: `Collecting more data... (${Math.round(confidence)}% < ${Math.round(this.confidenceThreshold * 100)}% threshold)`,
                belowThreshold: true
            };
        }

        return {
            number: bestNumber,
            confidence: Math.round(confidence),
            isBig: bestNumber >= 11,
            isEven: bestNumber % 2 === 0,
            contributors: predictions[bestNumber].contributors,
            algorithmResults,
            competitiveMode: this.competitiveMode
        };
    }

    // Algorithm 1: Frequency Analysis
    frequencyAnalysis() {
        const frequency = {};
        const recent = this.history.slice(-50);

        recent.forEach(roll => {
            frequency[roll.number] = (frequency[roll.number] || 0) + 1;
        });

        const avg = recent.length / 16;
        const predictions = [];

        for (let num = 3; num <= 18; num++) {
            const count = frequency[num] || 0;
            if (count > avg) {
                predictions.push({
                    number: num,
                    confidence: Math.min(1.0, count / (avg * 2))
                });
            }
        }

        return { predictions, data: frequency };
    }

    // Algorithm 2: Hot/Cold Numbers
    hotColdAnalysis() {
        const recent = this.history.slice(-30);
        const frequency = {};

        recent.forEach(roll => {
            frequency[roll.number] = (frequency[roll.number] || 0) + 1;
        });

        const values = Object.values(frequency);
        const max = Math.max(...values, 1);
        const predictions = [];

        for (const [num, count] of Object.entries(frequency)) {
            if (count >= max * 0.7) {
                predictions.push({
                    number: parseInt(num),
                    confidence: count / max
                });
            }
        }

        return { predictions, hot: frequency };
    }

    // Algorithm 3: Trend Analysis
    trendAnalysis() {
        const recent = this.history.slice(-10);
        if (recent.length < 5) return { predictions: [] };

        const sum = recent.reduce((acc, r) => acc + r.number, 0);
        const avg = sum / recent.length;
        const prevSum = this.history.slice(-20, -10).reduce((acc, r) => acc + r.number, 0);
        const prevAvg = this.history.length >= 20 ? prevSum / 10 : avg;
        const trend = avg - prevAvg;

        const predictions = [];
        const predicted = Math.round(avg + trend);

        if (predicted >= 3 && predicted <= 18) {
            predictions.push({
                number: predicted,
                confidence: Math.min(1.0, Math.abs(trend) / 3)
            });

            [-1, 1].forEach(offset => {
                const nearby = predicted + offset;
                if (nearby >= 3 && nearby <= 18) {
                    predictions.push({
                        number: nearby,
                        confidence: Math.min(0.8, Math.abs(trend) / 4)
                    });
                }
            });
        }

        return { predictions, trend, average: avg };
    }

    // Algorithm 4: Sequence Detection
    sequenceDetection() {
        const recent = this.history.slice(-15);
        if (recent.length < 3) return { predictions: [] };

        const patterns = [];

        for (let len = 2; len <= 5; len++) {
            for (let i = 0; i <= recent.length - len * 2; i++) {
                const seq1 = recent.slice(i, i + len).map(r => r.number);
                const seq2 = recent.slice(i + len, i + len * 2).map(r => r.number);

                if (JSON.stringify(seq1) === JSON.stringify(seq2)) {
                    patterns.push({ sequence: seq1, confidence: len / 5 });
                }
            }
        }

        if (patterns.length === 0) return { predictions: [] };

        const bestPattern = patterns.sort((a, b) => b.confidence - a.confidence)[0];
        const lastNumbers = recent.slice(-bestPattern.sequence.length).map(r => r.number);

        const predictions = [];
        if (JSON.stringify(lastNumbers) === JSON.stringify(bestPattern.sequence)) {
            const nextIndex = recent.length % bestPattern.sequence.length;
            predictions.push({
                number: bestPattern.sequence[nextIndex],
                confidence: bestPattern.confidence
            });
        }

        return { predictions, patterns };
    }

    // Algorithm 5: Cycle Detection
    cycleDetection() {
        if (this.history.length < 20) return { predictions: [] };

        const predictions = [];
        const numbers = this.history.map(r => r.number);

        for (let cycleLen = 3; cycleLen <= 10; cycleLen++) {
            const recent = numbers.slice(-cycleLen);
            let matchCount = 0;

            for (let i = numbers.length - cycleLen * 2; i >= 0; i -= cycleLen) {
                const cycle = numbers.slice(i, i + cycleLen);
                if (JSON.stringify(cycle) === JSON.stringify(recent)) {
                    matchCount++;
                }
            }

            if (matchCount >= 2) {
                const nextInCycle = numbers[numbers.length - cycleLen * 2 + cycleLen];
                if (nextInCycle) {
                    predictions.push({
                        number: nextInCycle,
                        confidence: Math.min(1.0, matchCount / 3)
                    });
                }
            }
        }

        return { predictions };
    }

    // Algorithm 6: Big/Small Momentum
    bigSmallMomentumAnalysis() {
        const recent = this.history.slice(-10);
        if (recent.length < 5) return { predictions: [] };

        const bigCount = recent.filter(r => r.isBig).length;
        const smallCount = recent.length - bigCount;
        const predictions = [];

        if (bigCount > smallCount * 1.5) {
            for (let num = 11; num <= 18; num++) {
                predictions.push({
                    number: num,
                    confidence: (bigCount / recent.length) * 0.7
                });
            }
        } else if (smallCount > bigCount * 1.5) {
            for (let num = 3; num <= 10; num++) {
                predictions.push({
                    number: num,
                    confidence: (smallCount / recent.length) * 0.7
                });
            }
        }

        return { predictions, bigCount, smallCount };
    }

    // Algorithm 7: Even/Odd Pattern
    evenOddPatternAnalysis() {
        const recent = this.history.slice(-10);
        if (recent.length < 5) return { predictions: [] };

        const evenCount = recent.filter(r => r.isEven).length;
        const oddCount = recent.length - evenCount;
        const predictions = [];

        const predictEven = evenCount > oddCount * 1.3;
        const predictOdd = oddCount > evenCount * 1.3;

        if (predictEven) {
            for (let num = 4; num <= 18; num += 2) {
                predictions.push({
                    number: num,
                    confidence: (evenCount / recent.length) * 0.6
                });
            }
        } else if (predictOdd) {
            for (let num = 3; num <= 17; num += 2) {
                predictions.push({
                    number: num,
                    confidence: (oddCount / recent.length) * 0.6
                });
            }
        }

        return { predictions, evenCount, oddCount };
    }

    // Algorithm 8: Gap Analysis
    gapAnalysis() {
        const gaps = {};
        const lastSeen = {};

        this.history.forEach((roll, index) => {
            if (lastSeen[roll.number] !== undefined) {
                const gap = index - lastSeen[roll.number];
                if (!gaps[roll.number]) gaps[roll.number] = [];
                gaps[roll.number].push(gap);
            }
            lastSeen[roll.number] = index;
        });

        const predictions = [];
        const currentIndex = this.history.length;

        for (const [num, gapList] of Object.entries(gaps)) {
            if (gapList.length >= 2) {
                const avgGap = gapList.reduce((a, b) => a + b, 0) / gapList.length;
                const currentGap = currentIndex - lastSeen[num];

                if (currentGap >= avgGap * 0.8) {
                    const confidence = Math.min(1.0, currentGap / avgGap);
                    predictions.push({
                        number: parseInt(num),
                        confidence: confidence * 0.7
                    });
                }
            }
        }

        return { predictions, gaps };
    }

    // Algorithm 9: Time of Day Pattern
    timeOfDayAnalysis() {
        if (!this.metadata || this.metadata.length < 10) {
            return { predictions: [] };
        }

        const now = new Date();
        const currentHour = now.getHours();

        let currentPeriod = 'night';
        if (currentHour >= 6 && currentHour < 12) currentPeriod = 'morning';
        else if (currentHour >= 12 && currentHour < 18) currentPeriod = 'afternoon';
        else if (currentHour >= 18 && currentHour < 24) currentPeriod = 'evening';

        const periodData = {};
        this.metadata.forEach((entry, idx) => {
            if (entry.period && this.history[idx]) {
                try {
                    const parsed = this.parsePeriod(entry.period);
                    const hour = parsed.hour;
                    let period = 'night';
                    if (hour >= 6 && hour < 12) period = 'morning';
                    else if (hour >= 12 && hour < 18) period = 'afternoon';
                    else if (hour >= 18 && hour < 24) period = 'evening';

                    if (period === currentPeriod) {
                        const num = this.history[idx].number;
                        periodData[num] = (periodData[num] || 0) + 1;
                    }
                } catch (e) { }
            }
        });

        const predictions = [];
        const total = Object.values(periodData).reduce((a, b) => a + b, 0);
        if (total > 0) {
            const avg = total / 16;
            Object.entries(periodData).forEach(([num, count]) => {
                if (count > avg) {
                    predictions.push({
                        number: parseInt(num),
                        confidence: Math.min(1.0, count / total * 2)
                    });
                }
            });
        }

        return { predictions, currentPeriod, data: periodData };
    }

    // Algorithm 10: Hourly Pattern
    hourlyPatternAnalysis() {
        if (!this.metadata || this.metadata.length < 10) {
            return { predictions: [] };
        }

        const now = new Date();
        const currentHour = now.getHours();

        const hourData = {};
        this.metadata.forEach((entry, idx) => {
            if (entry.period && this.history[idx]) {
                try {
                    const parsed = this.parsePeriod(entry.period);
                    if (parsed.hour === currentHour) {
                        const num = this.history[idx].number;
                        hourData[num] = (hourData[num] || 0) + 1;
                    }
                } catch (e) { }
            }
        });

        const predictions = [];
        const total = Object.values(hourData).reduce((a, b) => a + b, 0);
        if (total >= 3) {
            const sorted = Object.entries(hourData).sort((a, b) => b[1] - a[1]);
            sorted.slice(0, 5).forEach(([num, count]) => {
                predictions.push({
                    number: parseInt(num),
                    confidence: Math.min(1.0, count / total * 1.5)
                });
            });
        }

        return { predictions, currentHour, data: hourData };
    }

    // Algorithm 11: Time Window Analysis
    timeWindowAnalysis() {
        if (!this.metadata || this.metadata.length < 10) {
            return { predictions: [] };
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const windowData = {};
        this.metadata.forEach((entry, idx) => {
            if (entry.period && this.history[idx]) {
                try {
                    const parsed = this.parsePeriod(entry.period);
                    const hourDiff = Math.abs(parsed.hour - currentHour);
                    const minuteDiff = Math.abs(parsed.minute - currentMinute);

                    if (hourDiff === 0 && minuteDiff <= 15) {
                        const num = this.history[idx].number;
                        windowData[num] = (windowData[num] || 0) + 1;
                    }
                } catch (e) { }
            }
        });

        const predictions = [];
        const total = Object.values(windowData).reduce((a, b) => a + b, 0);
        if (total >= 2) {
            const sorted = Object.entries(windowData).sort((a, b) => b[1] - a[1]);
            sorted.slice(0, 3).forEach(([num, count]) => {
                predictions.push({
                    number: parseInt(num),
                    confidence: Math.min(1.0, count / total * 2)
                });
            });
        }

        return { predictions };
    }

    // Algorithm 12: Markov Chain Transitions
    markovChainAnalysis() {
        if (this.history.length < 15) {
            return { predictions: [] };
        }

        const transitions = {};
        const transitionCounts = {};

        for (let i = 0; i < this.history.length - 1; i++) {
            const from = this.history[i].number;
            const to = this.history[i + 1].number;

            transitions[from] = transitions[from] || {};
            transitions[from][to] = (transitions[from][to] || 0) + 1;
            transitionCounts[from] = (transitionCounts[from] || 0) + 1;
        }

        const lastNumber = this.history[this.history.length - 1].number;
        const predictions = [];

        if (transitions[lastNumber]) {
            const total = transitionCounts[lastNumber];
            Object.entries(transitions[lastNumber]).forEach(([num, count]) => {
                const probability = count / total;
                if (probability > 0.1) {
                    predictions.push({
                        number: parseInt(num),
                        confidence: probability
                    });
                }
            });
        }

        return { predictions, transitions, lastNumber };
    }

    // Algorithm 13: Bayesian Probability Engine
    bayesianProbabilityEngine() {
        if (this.history.length < 10) {
            return { predictions: [] };
        }

        const prior = {};
        for (let n = 3; n <= 18; n++) {
            prior[n] = 1 / 16;
        }

        const recentHistory = this.history.slice(-20);
        const recentFreq = {};
        recentHistory.forEach(entry => {
            recentFreq[entry.number] = (recentFreq[entry.number] || 0) + 1;
        });

        const posterior = {};
        const totalRecent = recentHistory.length;

        for (let n = 3; n <= 18; n++) {
            let prob = prior[n];

            if (recentFreq[n]) {
                prob *= (recentFreq[n] / totalRecent) * 2;
            }

            posterior[n] = prob;
        }

        const totalProb = Object.values(posterior).reduce((a, b) => a + b, 0);
        const predictions = [];

        Object.entries(posterior).forEach(([num, prob]) => {
            const normalized = prob / totalProb;
            if (normalized > 0.08) {
                predictions.push({
                    number: parseInt(num),
                    confidence: normalized * 1.5
                });
            }
        });

        return { predictions, posterior, prior };
    }

    // Algorithm 14: Streak & Momentum
    streakMomentumAnalysis() {
        if (this.history.length < 10) {
            return { predictions: [] };
        }

        const last10 = this.history.slice(-10);
        const streaks = { big: 0, small: 0, even: 0, odd: 0 };

        last10.forEach(entry => {
            if (entry.isBig) streaks.big++;
            else streaks.small++;
            if (entry.isEven) streaks.even++;
            else streaks.odd++;
        });

        const predictions = [];
        const bigMomentum = streaks.big / 10;
        const smallMomentum = streaks.small / 10;

        if (bigMomentum >= 0.7) {
            [11, 12, 13, 14, 15, 16, 17, 18].forEach(num => {
                predictions.push({
                    number: num,
                    confidence: bigMomentum
                });
            });
        } else if (smallMomentum >= 0.7) {
            [3, 4, 5, 6, 7, 8, 9, 10].forEach(num => {
                predictions.push({
                    number: num,
                    confidence: smallMomentum
                });
            });
        }

        return { predictions, streaks };
    }

    // Algorithm 15: Dice Correlation Analysis
    diceCorrelationAnalysis() {
        if (!this.metadata || this.metadata.length < 20) {
            return { predictions: [] };
        }

        const correlations = { combinations: {} };

        this.metadata.forEach(entry => {
            if (entry.dice && entry.dice.length === 3) {
                const comboKey = entry.dice.join(',');
                correlations.combinations[comboKey] = (correlations.combinations[comboKey] || 0) + 1;
            }
        });

        const predictions = [];
        const sorted = Object.entries(correlations.combinations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const total = this.metadata.filter(e => e.dice).length;
        sorted.forEach(([combo, count]) => {
            const dice = combo.split(',').map(Number);
            const sum = dice.reduce((a, b) => a + b, 0);
            const frequency = count / total;

            if (frequency > 0.05) {
                predictions.push({
                    number: sum,
                    confidence: frequency * 2,
                    dice: dice
                });
            }
        });

        return { predictions, correlations };
    }

    // Algorithm 16: Multi-Level Pattern Recognition
    multiLevelPatternRecognition() {
        if (this.history.length < 30) {
            return { predictions: [] };
        }

        const levels = {
            micro: this.history.slice(-5),
            meso: this.history.slice(-15),
            macro: this.history.slice(-50)
        };

        const patterns = {};

        Object.entries(levels).forEach(([level, data]) => {
            const freq = {};
            data.forEach(entry => {
                freq[entry.number] = (freq[entry.number] || 0) + 1;
            });
            patterns[level] = freq;
        });

        const predictions = [];
        for (let n = 3; n <= 18; n++) {
            const microFreq = (patterns.micro[n] || 0) / levels.micro.length;
            const mesoFreq = (patterns.meso[n] || 0) / levels.meso.length;
            const macroFreq = (patterns.macro[n] || 0) / levels.macro.length;

            const avgFreq = (microFreq + mesoFreq + macroFreq) / 3;
            const consistency = 1 - Math.abs(microFreq - mesoFreq) - Math.abs(mesoFreq - macroFreq);

            if (avgFreq > 0.15 && consistency > 0.5) {
                predictions.push({
                    number: n,
                    confidence: avgFreq * consistency
                });
            }
        }

        return { predictions, patterns };
    }

    // Algorithm 17: Streak Adaptation (NEW)
    // Adjusts weights dynamically based on recent winning streaks
    streakAdaptation() {
        if (this.history.length < 5) return { predictions: [] };

        // This is a meta-algorithm that boosts trend-following algorithms
        // if we are in a winning streak

        // This logic is simplified as we don't have access to "actual wins" here directly,
        // but we can infer stability. If variance is low, increase confidence.

        const recent = this.history.slice(-5).map(r => r.number);
        const variance = this.calculateVariance(recent);

        const predictions = [];

        // If variance is low (stable period), predict numbers close to average
        if (variance < 10) {
            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
            const target = Math.round(avg);
            predictions.push({
                number: target,
                confidence: 0.8 // High confidence in stability
            });
            // Also support neighbors
            if (target > 3) predictions.push({ number: target - 1, confidence: 0.5 });
            if (target < 18) predictions.push({ number: target + 1, confidence: 0.5 });
        }

        return { predictions, variance };
    }

    calculateVariance(array) {
        const mean = array.reduce((a, b) => a + b, 0) / array.length;
        return array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
    }

    calculateVariance(array) {
        const mean = array.reduce((a, b) => a + b, 0) / array.length;
        return array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
    }

    // Algorithm 18: Day of Week Pattern (NEW)
    // Analyzes if certain numbers are "lucky" on specific days
    dayPatternAnalysis() {
        if (this.history.length < 20) return { predictions: [] };

        const currentDay = new Date().getDay(); // 0-6
        const dayData = {};

        this.history.forEach(roll => {
            if (roll.dateMetadata && roll.dateMetadata.weekDay === currentDay) {
                dayData[roll.number] = (dayData[roll.number] || 0) + 1;
            }
        });

        const predictions = [];
        const totalForDay = Object.values(dayData).reduce((a, b) => a + b, 0);

        if (totalForDay > 10) {
            Object.entries(dayData).forEach(([num, count]) => {
                const freq = count / totalForDay;
                if (freq > 0.1) { // If number appears >10% of time on this day
                    predictions.push({
                        number: parseInt(num),
                        confidence: freq * 2
                    });
                }
            });
        }

        return { predictions, dayData };
    }

    // Helper: Parse period number
    parsePeriod(periodString) {
        const cleaned = periodString.replace(/\s+/g, '');
        return {
            year: parseInt(cleaned.substring(0, 4)),
            month: parseInt(cleaned.substring(4, 6)),
            day: parseInt(cleaned.substring(6, 8)),
            hour: parseInt(cleaned.substring(8, 10)),
            minute: parseInt(cleaned.substring(10, 12)),
            second: parseInt(cleaned.substring(12, 14)),
            run: cleaned.length > 14 ? parseInt(cleaned.substring(14)) : 0
        };
    }

    // Fallback: Random prediction
    getRandomPrediction() {
        const number = Math.floor(Math.random() * 16) + 3;
        return {
            number,
            confidence: 30,
            isBig: number >= 11,
            isEven: number % 2 === 0,
            contributors: ['random'],
            algorithmResults: {}
        };
    }

    // Get statistics
    getStatistics() {
        if (this.history.length === 0) {
            return {
                total: 0,
                bigCount: 0,
                smallCount: 0,
                evenCount: 0,
                oddCount: 0,
                avgNumber: 0,
                frequency: {},
                hot: '-',
                cold: '-'
            };
        }

        const frequency = {};
        let bigCount = 0;
        let smallCount = 0;
        let evenCount = 0;
        let oddCount = 0;
        let sum = 0;

        this.history.forEach(roll => {
            frequency[roll.number] = (frequency[roll.number] || 0) + 1;
            if (roll.isBig) bigCount++;
            else smallCount++;
            if (roll.isEven) evenCount++;
            else oddCount++;
            sum += roll.number;
        });

        // Calculate Hot/Cold
        const sortedFreq = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
        const hot = sortedFreq.length > 0 ? sortedFreq[0][0] : '-';
        const cold = sortedFreq.length > 0 ? sortedFreq[sortedFreq.length - 1][0] : '-';

        return {
            total: this.history.length,
            bigCount,
            smallCount,
            evenCount,
            oddCount,
            avgNumber: (sum / this.history.length).toFixed(2),
            frequency,
            hot,
            cold
        };
    }

    // Get hot/cold heatmap data
    getHeatmapData() {
        const frequency = {};
        const recent = this.history.slice(-50);

        for (let num = 3; num <= 18; num++) {
            frequency[num] = 0;
        }

        recent.forEach(roll => {
            frequency[roll.number]++;
        });

        const values = Object.values(frequency);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;

        const heatmap = {};
        for (let num = 3; num <= 18; num++) {
            const count = frequency[num];
            let level = 'neutral';

            if (count >= avg * 1.5) level = 'hot';
            else if (count >= avg * 1.2) level = 'warm';
            else if (count < avg * 0.5) level = 'cold';

            heatmap[num] = { count, level };
        }

        return heatmap;
    }

    // Clear history
    clearHistory() {
        this.history = [];
        this.metadata = [];
    }

    // Load history
    loadHistory(history) {
        this.history = history;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PredictionEngine;
}
