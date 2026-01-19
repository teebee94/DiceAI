// =======================================
// Voice Commands
// Control app with voice
// =======================================

class VoiceCommands {
    constructor(app) {
        this.app = app;
        this.recognition = null;
        this.isListening = false;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

        if (this.isSupported) {
            this.initSpeechRecognition();
        }
    }

    // Initialize speech recognition
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log('Voice command:', command);
            this.processCommand(command);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };
    }

    // Start listening
    startListening() {
        if (!this.isSupported) {
            alert('Voice commands not supported in this browser');
            return false;
        }

        if (this.isListening) return true;

        try {
            this.recognition.start();
            this.isListening = true;
            this.speak('Listening...');
            return true;
        } catch (e) {
            console.error('Failed to start recognition:', e);
            return false;
        }
    }

    // Stop listening
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateUI(false);
        }
    }

    // Toggle listening
    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    // Update UI state
    updateUI(listening) {
        const btn = document.getElementById('voiceCommandBtn');
        if (btn) {
            if (listening) {
                btn.classList.add('listening');
                btn.style.background = 'var(--color-error)';
                btn.innerHTML = '🛑';
            } else {
                btn.classList.remove('listening');
                btn.style.background = 'var(--color-accent)';
                btn.innerHTML = '🎤';
            }
        }
    }

    // Process voice command
    processCommand(command) {
        // Prediction commands
        if (command.includes('predict') || command.includes('prediction')) {
            const prediction = this.app.generatePrediction();
            this.speak(`My prediction is ${prediction.number} with ${prediction.confidence}% confidence`);
        }
        // Top 3
        else if (command.includes('top three') || command.includes('top 3')) {
            const top3 = this.app.advancedPredictor?.getNext3Predictions();
            if (top3 && top3.length > 0) {
                this.speak(`Top three: ${top3[0].number}, ${top3[1].number}, ${top3[2].number}`);
            }
        }
        // Betting suggestion
        else if (command.includes('should i bet') || command.includes('betting')) {
            const suggestion = this.app.automationEngine?.getBettingSuggestion();
            if (suggestion) {
                if (suggestion.shouldBet) {
                    this.speak(`Yes, bet ${suggestion.betAmount} on ${suggestion.prediction.number}. ${suggestion.reason}`);
                } else {
                    this.speak(`Skip this round. ${suggestion.reason}`);
                }
            }
        }
        // Accuracy
        else if (command.includes('accuracy') || command.includes('how am i doing')) {
            const stats = this.app.analyticsEngine?.getWinLossStats();
            if (stats) {
                this.speak(`Your accuracy is ${stats.accuracy}%. ${stats.correctPredictions} correct out of ${stats.totalPredictions} predictions.`);
            }
        }
        // Streak
        else if (command.includes('streak')) {
            const streaks = this.app.analyticsEngine?.getStreakStats();
            if (streaks && streaks.currentStreak > 0) {
                this.speak(`You have a ${streaks.currentStreak} ${streaks.currentStreakType} streak.`);
            } else {
                this.speak('No active streak.');
            }
        }
        // Best time
        else if (command.includes('best time') || command.includes('when to play')) {
            const timing = this.app.automationEngine?.getBestTiming();
            if (timing && timing.bestHours.length > 0) {
                this.speak(`Best time to play is ${timing.bestHours[0].hour} o'clock with ${timing.bestHours[0].accuracy}% accuracy.`);
            }
        }
        // Data cleanup
        else if (command.includes('clean') || command.includes('fix data')) {
            this.app.aiChat?.processCommand('cleanup').then(response => {
                this.speak(response);
            });
        }
        // Help
        else if (command.includes('help') || command.includes('what can you do')) {
            this.speak('You can ask me for predictions, top three numbers, betting suggestions, accuracy, streaks, best time to play, or data cleanup.');
        }
        // Hot/Cold Analysis (NEW)
        else if (command.includes('hot') || command.includes('cold')) {
            const stats = this.app.predictionEngine.getStatistics();
            this.speak(`The hot number is ${stats.hot}. The cold number is ${stats.cold}.`);
        }
        // Deep Analysis (NEW)
        else if (command.includes('analyze') || command.includes('analysis')) {
            const history = this.app.predictionEngine.history.slice(-10);
            if (history.length < 5) {
                this.speak("Not enough data for deep analysis. Add more numbers first.");
            } else {
                const bigs = history.filter(h => h.isBig).length;
                const evens = history.filter(h => h.isEven).length;
                const trend = bigs > 5 ? "Big numbers" : "Small numbers";
                const parity = evens > 5 ? "Even numbers" : "Odd numbers";
                this.speak(`Analysis of last 10 rounds: ${trend} are trending. ${parity} are dominating.`);
            }
        }
        // Unknown
        else {
            this.speak('Sorry, I didn\'t understand that command. Say help for available commands.');
        }
    }

    // Text-to-speech
    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            speechSynthesis.speak(utterance);
        } else {
            console.log('TTS:', text);
        }
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceCommands;
}
