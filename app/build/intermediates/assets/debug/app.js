// =======================================
// Main Application Logic
// Ties together all components
// =======================================

class DicePredictionApp {
    constructor() {
        this.periodParser = new PeriodParser();
        this.currentTimeframe = '3min'; // Default timeframe

        // Separate data storage per timeframe
        this.timeframeData = {
            '1min': {
                predictionEngine: new PredictionEngine(),
                learningEngine: null,
                metadata: [],
                lastPeriod: null
            },
            '3min': {
                predictionEngine: new PredictionEngine(),
                learningEngine: null,
                metadata: [],
                lastPeriod: null
            },
            '5min': {
                predictionEngine: new PredictionEngine(),
                learningEngine: null,
                metadata: [],
                lastPeriod: null
            },
            '10min': {
                predictionEngine: new PredictionEngine(),
                learningEngine: null,
                metadata: [],
                lastPeriod: null
            }
        };

        // Initialize learning engines
        Object.keys(this.timeframeData).forEach(tf => {
            this.timeframeData[tf].learningEngine = new LearningEngine(this.timeframeData[tf].predictionEngine);
        });

        this.imageAnalyzer = new ImageAnalyzer();
        this.lastPrediction = null;
        this.pendingFeedback = false;

        this.init();
    }

    // Get current timeframe data
    get currentData() {
        return this.timeframeData[this.currentTimeframe];
    }

    get predictionEngine() {
        return this.currentData.predictionEngine;
    }

    get learningEngine() {
        return this.currentData.learningEngine;
    }

    get metadata() {
        return this.currentData.metadata;
    }

    set metadata(value) {
        this.currentData.metadata = value;
    }

    get lastPeriod() {
        return this.currentData.lastPeriod;
    }

    set lastPeriod(value) {
        this.currentData.lastPeriod = value;
    }

    // Initialize app
    init() {
        this.loadData();
        this.setupUI();
        this.setupEventListeners();
        this.setupDiceInputListeners();
        this.setupPeriodInputListeners();
        this.updateAllDisplays();
        this.updateCurrentGameInfo();
    }

    // Setup UI elements
    setupUI() {
        // Create number pad
        this.createNumberPad();

        // Create heatmap
        this.createHeatmap();
    }

    // Create number pad (3-18)
    createNumberPad() {
        const numberPad = document.getElementById('numberPad');
        numberPad.innerHTML = '';

        for (let num = 3; num <= 18; num++) {
            const btn = document.createElement('button');
            btn.className = `number-btn ${num >= 11 ? 'big' : 'small'}`;
            btn.textContent = num;
            btn.onclick = () => this.addNumber(num);
            numberPad.appendChild(btn);
        }
    }

    // Create heatmap cells
    createHeatmap() {
        const heatmap = document.getElementById('heatmap');
        heatmap.innerHTML = '';

        for (let num = 3; num <= 18; num++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell neutral';
            cell.textContent = num;
            cell.id = `heatmap-${num}`;
            heatmap.appendChild(cell);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Upload zone
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            this.handleImageUpload(files);
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleImageUpload(files);
            fileInput.value = ''; // Reset input
        });

        // Import/Export
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('importInput').click();
        });

        const importInput = document.getElementById('importInput');
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        this.predictionEngine.loadHistory(data.history || []);
                        if (data.learningData) {
                            this.learningEngine.importLearningData(data.learningData);
                        }
                        this.saveData();
                        this.updateAllDisplays();
                        this.showNotification('Data imported successfully!', 'success');
                    } catch (error) {
                        this.showNotification('Error importing data', 'error');
                    }
                };
                reader.readAsText(file);
            }
            importInput.value = '';
        });

        // Competitive Mode Toggle
        document.getElementById('competitiveModeToggle').addEventListener('change', (e) => {
            this.toggleCompetitiveMode(e.target.checked);
        });

        document.getElementById('confidenceThreshold').addEventListener('input', (e) => {
            this.updateConfidenceThreshold(e.target.value);
        });

        // Timeframe selector
        document.getElementById('timeframeSelect').addEventListener('change', (e) => {
            this.changeTimeframe(e.target.value);
        });
    }

    // Setup dice input listeners
    setupDiceInputListeners() {
        const dice1 = document.getElementById('dice1');
        const dice2 = document.getElementById('dice2');
        const dice3 = document.getElementById('dice3');
        const diceSum = document.getElementById('diceSum');

        const updateSum = () => {
            const d1 = parseInt(dice1.value) || 0;
            const d2 = parseInt(dice2.value) || 0;
            const d3 = parseInt(dice3.value) || 0;

            if (d1 >= 1 && d1 <= 6 && d2 >= 1 && d2 <= 6 && d3 >= 1 && d3 <= 6) {
                const sum = d1 + d2 + d3;
                diceSum.textContent = `Sum: ${sum} â€¢ ${sum >= 11 ? 'BIG' : 'SMALL'} â€¢ ${sum % 2 === 0 ? 'EVEN' : 'ODD'}`;
                diceSum.style.color = 'var(--color-success)';
            } else {
                diceSum.textContent = '';
            }
        };

        dice1.addEventListener('input', updateSum);
        dice2.addEventListener('input', updateSum);
        dice3.addEventListener('input', updateSum);
    }

    // Setup period input listeners
    setupPeriodInputListeners() {
        const periodInput = document.getElementById('periodInput');
        const periodValidation = document.getElementById('periodValidation');

        periodInput.addEventListener('input', () => {
            const value = periodInput.value.trim();
            if (value.length === 0) {
                periodValidation.textContent = '';
                periodValidation.className = '';
                return;
            }

            if (this.periodParser.isValidPeriod(value)) {
                const formatted = this.periodParser.formatPeriodDisplay(value);
                periodValidation.textContent = `âœ“ Valid: ${formatted}`;
                periodValidation.className = 'valid';
                this.lastPeriod = value;
            } else {
                periodValidation.textContent = 'âœ— Invalid format. Expected: YYYYMMDDHHMMSSXXX';
                periodValidation.className = 'invalid';
            }
        });
    }

    // Change timeframe
    changeTimeframe(newTimeframe) {
        // Save current timeframe state before switching
        this.saveData();

        // Switch to new timeframe
        this.currentTimeframe = newTimeframe;

        // Update period input with last period for this timeframe
        const periodInput = document.getElementById('periodInput');
        if (this.lastPeriod) {
            periodInput.value = this.lastPeriod;
            periodInput.dispatchEvent(new Event('input'));
        } else {
            periodInput.value = '';
            document.getElementById('periodValidation').textContent = '';
        }

        // Clear any pending predictions
        this.lastPrediction = null;
        this.pendingFeedback = false;
        this.hideFeedbackButtons();

        // Refresh all displays with new timeframe data
        this.updateAllDisplays();
        this.updateCurrentGameInfo();

        const tfInfo = this.periodParser.getTimeframeInfo(newTimeframe);
        const stats = this.predictionEngine.getStatistics();
        this.showNotification(`Switched to ${tfInfo.name} mode (${stats.total} entries)`, 'success');
    }

    // Update current game info display
    updateCurrentGameInfo() {
        const info = this.periodParser.getTimeframeInfo(this.currentTimeframe);
        if (!info) return;

        const currentRunSpan = document.getElementById('currentRunNumber');
        const nextPeriodSpan = document.getElementById('nextPeriodNumber');

        if (this.lastPeriod) {
            try {
                const parsed = this.periodParser.parsePeriod(this.lastPeriod);
                currentRunSpan.textContent = `#${parsed.run}`;

                const nextPeriod = this.periodParser.getNextPeriod(this.lastPeriod, this.currentTimeframe);
                const nextParsed = this.periodParser.parsePeriod(nextPeriod);
                nextPeriodSpan.textContent = `#${nextParsed.run}`;
            } catch (e) {
                currentRunSpan.textContent = '--';
                nextPeriodSpan.textContent = '--';
            }
        } else {
            currentRunSpan.textContent = '--';
            nextPeriodSpan.textContent = '--';
        }
    }

    // Add number to history
    addNumber(number) {
        // Auto-verify last prediction if feedback pending
        if (this.pendingFeedback && this.lastPrediction) {
            const isCorrect = this.lastPrediction.number === number;
            this.learningEngine.recordFeedback(this.lastPrediction, number, isCorrect);
            this.pendingFeedback = false;
            this.hideFeedbackButtons();
        }

        // Get period and dice values
        const periodInput = document.getElementById('periodInput');
        const dice1 = parseInt(document.getElementById('dice1').value) || null;
        const dice2 = parseInt(document.getElementById('dice2').value) || null;
        const dice3 = parseInt(document.getElementById('dice3').value) || null;

        // Validate dice sum matches number if dice are provided
        if (dice1 && dice2 && dice3) {
            const sum = dice1 + dice2 + dice3;
            if (sum !== number) {
                alert(`Dice sum (${sum}) doesn't match selected number (${number})!`);
                return;
            }
        }

        // Get period number
        const period = periodInput.value.trim() || null;
        if (period && !this.periodParser.isValidPeriod(period)) {
            alert('Invalid period number format!');
            return;
        }

        // Create enhanced entry with period and dice data
        const entry = {
            number,
            timestamp: Date.now(),
            isBig: number >= 11,
            isEven: number % 2 === 0,
            period: period,
            dice: (dice1 && dice2 && dice3) ? [dice1, dice2, dice3] : null,
            timeframe: this.currentTimeframe
        };

        // Add to prediction engine (passing just number for backwards compatibility)
        this.predictionEngine.addRoll(number);

        // Link metadata to prediction engine for time-based algorithms
        this.predictionEngine.metadata = this.currentData.metadata;

        // Store enhanced entry metadata in timeframe-specific storage
        this.currentData.metadata.push(entry);

        // Update last period for auto-increment
        if (period) {
            this.lastPeriod = period;
            // Auto-generate next period
            const nextPeriod = this.periodParser.getNextPeriod(period, this.currentTimeframe);
            periodInput.value = nextPeriod;
            // Trigger validation
            periodInput.dispatchEvent(new Event('input'));
        }

        // Clear dice inputs
        document.getElementById('dice1').value = '';
        document.getElementById('dice2').value = '';
        document.getElementById('dice3').value = '';
        document.getElementById('diceSum').textContent = '';

        // Save and update UI
        this.saveData();
        this.updateAllDisplays();
        this.updateCurrentGameInfo();

        // Show success animation
        this.showNotification(`Added ${number} to history`, 'success');
    }

    // Generate prediction
    generatePrediction() {
        const prediction = this.predictionEngine.getPrediction();
        this.lastPrediction = prediction;
        this.pendingFeedback = true;

        // Update prediction display
        document.getElementById('predictionNumber').textContent = prediction.number;

        const meta = `
      <span class="prediction-tag ${prediction.isBig ? 'badge-error' : 'badge-success'}">
        ${prediction.isBig ? 'BIG (11-18)' : 'SMALL (3-10)'}
      </span>
      <span class="prediction-tag ${prediction.isEven ? 'badge-primary' : 'badge-warning'}">
        ${prediction.isEven ? 'EVEN' : 'ODD'}
      </span>
    `;
        document.getElementById('predictionMeta').innerHTML = meta;

        // Update confidence bar
        const confidenceFill = document.getElementById('confidenceFill');
        confidenceFill.style.width = `${prediction.confidence}%`;

        const confidenceText = document.getElementById('confidenceText');
        confidenceText.textContent = `Confidence: ${prediction.confidence}% â€¢ Using ${prediction.contributors?.length || 0} algorithms`;

        // Show feedback buttons
        this.showFeedbackButtons();

        // Show notification
        this.showNotification('Prediction generated!', 'success');
    }

    // Submit feedback
    submitFeedback(isCorrect) {
        if (!this.lastPrediction) return;

        // Record feedback (without actual number since user is manually confirming)
        this.learningEngine.feedbackHistory.push({
            timestamp: Date.now(),
            predicted: this.lastPrediction.number,
            actual: null, // Manual feedback
            isCorrect,
            confidence: this.lastPrediction.confidence,
            contributors: this.lastPrediction.contributors || []
        });

        // Update algorithm performance
        if (this.lastPrediction.contributors) {
            this.lastPrediction.contributors.forEach(algoName => {
                if (this.learningEngine.algorithmPerformance[algoName]) {
                    this.learningEngine.updateAlgorithmPerformance(algoName, isCorrect);
                }
            });
        }

        // Adjust weights
        this.learningEngine.adjustWeights();

        this.pendingFeedback = false;
        this.hideFeedbackButtons();
        this.saveData();
        this.updateAllDisplays();

        this.showNotification(
            isCorrect ? 'âœ“ Great! System is learning...' : 'âœ— Noted. Adjusting algorithms...',
            isCorrect ? 'success' : 'warning'
        );
    }

    // Handle image upload
    async handleImageUpload(files) {
        if (files.length === 0) return;

        // Show progress
        document.getElementById('uploadProgress').style.display = 'block';
        document.getElementById('uploadProgressFill').style.width = '0%';
        document.getElementById('uploadStatus').textContent = 'Initializing OCR...';

        // Initialize image analyzer
        this.imageAnalyzer.setBatchProgressCallback((current, total) => {
            const progress = ((current + 1) / total) * 100;
            document.getElementById('uploadProgressFill').style.width = `${progress}%`;
            document.getElementById('uploadStatus').textContent = `Processing image ${current + 1} of ${total}...`;
        });

        try {
            const { results, errors } = await this.imageAnalyzer.processBatch(files);

            // Hide progress
            document.getElementById('uploadProgress').style.display = 'none';

            // Display extracted numbers
            this.displayExtractedNumbers(results, errors);

        } catch (error) {
            document.getElementById('uploadProgress').style.display = 'none';
            alert('Error processing images: ' + error.message);
        }
    }

    // Display extracted numbers from images
    displayExtractedNumbers(results, errors) {
        const container = document.getElementById('extractedNumbers');
        container.innerHTML = '';

        if (results.length === 0 && errors.length === 0) return;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-md); background: var(--color-bg-tertiary);';

        // Show results
        if (results.length > 0) {
            const title = document.createElement('div');
            title.style.cssText = 'font-weight: 700; margin-bottom: var(--space-md); color: var(--color-success);';
            title.textContent = `âœ“ Extracted ${results.reduce((sum, r) => sum + r.numbers.length, 0)} numbers from ${results.length} images`;
            wrapper.appendChild(title);

            results.forEach(result => {
                if (result.numbers.length > 0) {
                    const item = document.createElement('div');
                    item.style.cssText = 'margin-bottom: var(--space-sm); padding: var(--space-sm); background: var(--color-bg-card); border-radius: var(--radius-sm);';
                    item.innerHTML = `
            <div style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${result.fileName}</div>
            <div style="margin-top: var(--space-xs);">
              ${result.numbers.map(num => `<span class="badge badge-primary" style="margin-right: var(--space-xs);">${num}</span>`).join('')}
            </div>
          `;
                    wrapper.appendChild(item);
                }
            });

            const addButton = document.createElement('button');
            addButton.className = 'btn btn-success mt-md';
            addButton.textContent = 'Add All to History';
            addButton.onclick = () => {
                results.forEach(result => {
                    result.numbers.forEach(num => this.predictionEngine.addRoll(num));
                });
                this.saveData();
                this.updateAllDisplays();
                container.innerHTML = '';
                this.showNotification(`Added ${results.reduce((sum, r) => sum + r.numbers.length, 0)} numbers!`, 'success');
            };
            wrapper.appendChild(addButton);
        }

        // Show errors
        if (errors.length > 0) {
            const errorTitle = document.createElement('div');
            errorTitle.style.cssText = 'font-weight: 700; margin-top: var(--space-md); color: var(--color-error);';
            errorTitle.textContent = `âš  ${errors.length} errors`;
            wrapper.appendChild(errorTitle);

            errors.forEach(err => {
                const item = document.createElement('div');
                item.style.cssText = 'font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-xs);';
                item.textContent = `${err.fileName}: ${err.error}`;
                wrapper.appendChild(item);
            });
        }

        container.appendChild(wrapper);
    }

    // Update all UI displays
    updateAllDisplays() {
        this.updateStatistics();
        this.updateHeatmap();
        this.updateHistory();
        this.updateLearningStatus();
        this.updateAlgorithmChart();
    }

    // Update statistics
    updateStatistics() {
        const stats = this.predictionEngine.getStatistics();
        const accuracy = this.learningEngine.getOverallAccuracy();

        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('statAccuracy').textContent =
            this.learningEngine.feedbackHistory.length > 0 ? `${accuracy.toFixed(1)}%` : '--%';
        document.getElementById('statBig').textContent = stats.bigCount;
        document.getElementById('statSmall').textContent = stats.smallCount;
    }

    // Update heatmap
    updateHeatmap() {
        const heatmapData = this.predictionEngine.getHeatmapData();

        for (let num = 3; num <= 18; num++) {
            const cell = document.getElementById(`heatmap-${num}`);
            if (cell && heatmapData[num]) {
                cell.className = `heatmap-cell ${heatmapData[num].level}`;
            }
        }
    }

    // Update history table
    updateHistory() {
        const tbody = document.getElementById('historyTableBody');
        const history = this.predictionEngine.history;
        const metadata = this.currentData.metadata;

        if (history.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: var(--space-xl); color: var(--color-text-muted);">
            No history yet. Add numbers to start predicting!
          </td>
        </tr>
      `;
            return;
        }

        // Show last 50 entries (newest first)
        const recentHistory = history.slice(-50).reverse();

        tbody.innerHTML = recentHistory.map((entry, idx) => {
            const actualIdx = history.length - idx - 1;
            const meta = metadata[actualIdx] || {};
            const feedback = this.getFeedbackForIndex(actualIdx);

            // Format period
            const periodDisplay = meta.period
                ? this.periodParser.formatPeriodDisplay(meta.period).split(' ')[2] // Just show #XXX
                : '-';

            // Format dice
            const diceDisplay = meta.dice
                ? meta.dice.map(d => `<span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background: var(--color-bg-tertiary); border-radius: var(--radius-sm); margin: 0 2px;">${d}</span>`).join('')
                : '-';

            return `
        <tr>
          <td>${actualIdx + 1}</td>
          <td style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${periodDisplay}</td>
          <td style="font-weight: 700; font-size: var(--font-size-lg);">${entry.number}</td>
          <td>${diceDisplay}</td>
          <td><span class="badge ${entry.isBig ? 'badge-error' : 'badge-success'}">${entry.isBig ? 'Big' : 'Small'}</span></td>
          <td><span class="badge ${entry.isEven ? 'badge-primary' : 'badge-warning'}">${entry.isEven ? 'Even' : 'Odd'}</span></td>
          <td>${feedback}</td>
          <td style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${this.formatTime(entry.timestamp)}</td>
        </tr>
      `;
        }).join('');
    }

    // Get feedback badge for history index
    getFeedbackForIndex(index) {
        // Check if this number was part of a prediction
        const feedback = this.learningEngine.feedbackHistory.find(f => {
            const historyEntry = this.predictionEngine.history[index];
            return f.actual === historyEntry?.number || f.timestamp === historyEntry?.timestamp;
        });

        if (!feedback) return '<span style="color: var(--color-text-muted);">-</span>';

        return feedback.isCorrect
            ? '<span class="badge badge-success">âœ“ Correct</span>'
            : '<span class="badge badge-error">âœ— Wrong</span>';
    }

    // Update learning status
    updateLearningStatus() {
        const insights = this.learningEngine.getLearningInsights();
        const container = document.getElementById('learningInsights');

        if (insights.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">Add data and provide feedback to see learning progress...</p>';
            return;
        }

        container.innerHTML = insights.map(insight => {
            const colors = {
                success: 'var(--color-success)',
                warning: 'var(--color-warning)',
                info: 'var(--color-secondary)'
            };

            return `
        <div style="padding: var(--space-sm); margin-bottom: var(--space-sm); background: var(--color-bg-tertiary); border-left: 3px solid ${colors[insight.type]}; border-radius: var(--radius-sm);">
          <span style="font-size: var(--font-size-sm);">${insight.message}</span>
        </div>
      `;
        }).join('');
    }

    // Update algorithm performance chart
    updateAlgorithmChart() {
        const stats = this.learningEngine.getAlgorithmStats();
        const container = document.getElementById('algorithmChart');

        if (stats.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; font-size: var(--font-size-sm);">Algorithm performance will appear after providing feedback...</p>';
            return;
        }

        container.innerHTML = stats.slice(0, 5).map(stat => `
      <div class="algorithm-item">
        <div class="algorithm-header">
          <span class="algorithm-name">${stat.name}</span>
          <span class="algorithm-accuracy">${stat.accuracy}%</span>
        </div>
        <div class="algorithm-bar">
          <div class="algorithm-fill" style="width: ${stat.accuracy}%"></div>
        </div>
      </div>
    `).join('');
    }

    // Show/hide feedback buttons
    showFeedbackButtons() {
        document.getElementById('feedbackButtons').style.display = 'flex';
    }

    hideFeedbackButtons() {
        document.getElementById('feedbackButtons').style.display = 'none';
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Simple notification (you could enhance this with a toast library)
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // Format timestamp
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

        return date.toLocaleDateString();
    }

    // Data persistence
    saveData() {
        const data = {
            currentTimeframe: this.currentTimeframe,
            timeframes: {},
            timestamp: Date.now()
        };

        // Save each timeframe's data separately
        Object.keys(this.timeframeData).forEach(tf => {
            const tfData = this.timeframeData[tf];
            data.timeframes[tf] = {
                history: tfData.predictionEngine.history,
                metadata: tfData.metadata,
                learningData: tfData.learningEngine.exportLearningData(),
                lastPeriod: tfData.lastPeriod
            };
        });

        localStorage.setItem('dicePredictionData', JSON.stringify(data));
    }

    loadData() {
        const saved = localStorage.getItem('dicePredictionData');
        if (saved) {
            try {
                const data = JSON.parse(saved);

                // Check if this is new format (separate timeframes) or old format
                if (data.timeframes) {
                    // New format: Load each timeframe's data
                    Object.keys(data.timeframes).forEach(tf => {
                        if (this.timeframeData[tf]) {
                            const tfData = data.timeframes[tf];
                            this.timeframeData[tf].predictionEngine.loadHistory(tfData.history || []);
                            this.timeframeData[tf].metadata = tfData.metadata || [];
                            this.timeframeData[tf].lastPeriod = tfData.lastPeriod || null;

                            if (tfData.learningData) {
                                this.timeframeData[tf].learningEngine.importLearningData(tfData.learningData);
                            }
                        }
                    });
                } else {
                    // Old format: Migrate to current timeframe only
                    const tf = data.currentTimeframe || '3min';
                    if (this.timeframeData[tf]) {
                        this.timeframeData[tf].predictionEngine.loadHistory(data.history || []);
                        this.timeframeData[tf].metadata = data.metadata || [];
                        this.timeframeData[tf].lastPeriod = data.lastPeriod || null;

                        if (data.learningData) {
                            this.timeframeData[tf].learningEngine.importLearningData(data.learningData);
                        }
                    }
                }

                // Restore current timeframe selection
                if (data.currentTimeframe) {
                    this.currentTimeframe = data.currentTimeframe;
                    document.getElementById('timeframeSelect').value = data.currentTimeframe;
                }

                // Update period input with current timeframe's last period
                if (this.lastPeriod) {
                    document.getElementById('periodInput').value = this.lastPeriod;
                    document.getElementById('periodInput').dispatchEvent(new Event('input'));
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    // Export data
    exportData() {
        const data = {
            history: this.predictionEngine.history,
            learningData: this.learningEngine.exportLearningData(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dice-prediction-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    // Import data
    importData() {
        document.getElementById('importInput').click();
    }

    importDataFromJSON(data) {
        if (data.history) {
            this.predictionEngine.loadHistory(data.history);
        }
        if (data.learningData) {
            this.learningEngine.importLearningData(data.learningData);
        }
        this.saveData();
        this.updateAllDisplays();
        this.showNotification('Data imported successfully!', 'success');
    }

    // Clear all data
    clearAll() {
        if (!confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            return;
        }

        this.predictionEngine.clearHistory();
        this.learningEngine.clearLearningData();
        this.lastPrediction = null;
        this.pendingFeedback = false;

        this.saveData();
        this.updateAllDisplays();
        this.hideFeedbackButtons();

        document.getElementById('predictionNumber').textContent = '--';
        document.getElementById('predictionMeta').innerHTML = '<span class="prediction-tag">Click "Generate Prediction" to start</span>';
        document.getElementById('confidenceFill').style.width = '0%';
        document.getElementById('confidenceText').textContent = '';

        this.showNotification('All data cleared!', 'warning');
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DicePredictionApp();
});

    // Toggle competitive mode
    toggleCompetitiveMode(enabled) {
        this.predictionEngine.competitiveMode = enabled;
        const container = document.getElementById('confidenceThresholdContainer');
        if (container) container.style.display = enabled ? 'block' : 'none';
        
        if (enabled) {
            this.showNotification('🏆 Competitive Mode ON - Only high-confidence predictions', 'success');
        } else {
            this.showNotification('Competitive Mode OFF', 'info');
        }
        
        this.saveData();
    }

    // Update confidence threshold
    updateConfidenceThreshold(value) {
        this.predictionEngine.confidenceThreshold = value / 100;
        const valEl = document.getElementById('thresholdValue');
        if (valEl) valEl.textContent = value;
        this.saveData();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DicePredictionApp();
});
