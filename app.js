// =======================================
// Main Application Logic
// Ties together all components
// =======================================

class DicePredictionApp {
    constructor() {
        this.periodParser = new PeriodParser();
        this.currentTimeframe = '3min';

        // Separate data storage per timeframe
        this.timeframeData = {
            '1min': { predictionEngine: new PredictionEngine(), learningEngine: null, metadata: [], lastPeriod: null },
            '3min': { predictionEngine: new PredictionEngine(), learningEngine: null, metadata: [], lastPeriod: null },
            '5min': { predictionEngine: new PredictionEngine(), learningEngine: null, metadata: [], lastPeriod: null },
            '10min': { predictionEngine: new PredictionEngine(), learningEngine: null, metadata: [], lastPeriod: null }
        };

        // Initialize learning engines
        Object.keys(this.timeframeData).forEach(tf => {
            this.timeframeData[tf].learningEngine = new LearningEngine(this.timeframeData[tf].predictionEngine);
        });

        this.imageAnalyzer = new ImageAnalyzer();
        this.lastPrediction = null;
        this.pendingFeedback = false;

        // AI Insights
        this.aiInsights = new AIInsights(this.predictionEngine, this.learningEngine);

        // Advanced AI
        this.advancedAI = new AdvancedAI(this.predictionEngine, this.aiInsights);

        // Theme Manager
        this.themeManager = new ThemeManager();

        // Firebase Sync (if available)
        this.firebaseSync = null;
        if (typeof FirebaseSync !== 'undefined') {
            this.firebaseSync = new FirebaseSync(this);
            console.log('📡 Firebase Sync initialized');
        }

        // Data Manager (if available)
        this.dataManager = null;
        if (typeof DataManager !== 'undefined') {
            this.dataManager = new DataManager(this);
            console.log('🔧 Data Manager initialized');
        }

        // AI Chat Assistant (if available)
        this.aiChat = null;
        if (typeof AIChatAssistant !== 'undefined' && this.dataManager) {
            this.aiChat = new AIChatAssistant(this, this.dataManager);
            console.log('🤖 AI Chat Assistant initialized');
        }

        // Analytics Engine (if available)
        this.analyticsEngine = null;
        if (typeof AnalyticsEngine !== 'undefined') {
            this.analyticsEngine = new AnalyticsEngine(this);
            console.log('📊 Analytics Engine initialized');
        }

        // Chart Visualizer (if available)
        this.chartVisualizer = null;
        if (typeof ChartVisualizer !== 'undefined' && this.analyticsEngine) {
            this.chartVisualizer = new ChartVisualizer(this, this.analyticsEngine);
            console.log('📈 Chart Visualizer initialized');
        }

        // Prediction Tracker (if available)
        this.predictionTracker = null;
        if (typeof PredictionTracker !== 'undefined') {
            this.predictionTracker = new PredictionTracker(this);
            this.predictionTracker.loadFromStorage();
            console.log('🎯 Prediction Tracker initialized');
        }

        // Advanced Predictor (if available)
        this.advancedPredictor = null;
        if (typeof AdvancedPredictor !== 'undefined') {
            this.advancedPredictor = new AdvancedPredictor(this.predictionEngine);
            console.log('🔮 Advanced Predictor initialized');
        }

        // Notification Manager (if available)
        this.notificationManager = null;
        if (typeof NotificationManager !== 'undefined') {
            this.notificationManager = new NotificationManager(this);
            console.log('🔔 Notification Manager initialized');
        }

        // Automation Engine (if available)
        this.automationEngine = null;
        if (typeof AutomationEngine !== 'undefined') {
            this.automationEngine = new AutomationEngine(this);
            console.log('🤖 Automation Engine initialized');
        }

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
        this.createNumberPad();
        this.createHeatmap();
        this.addThemeSelector(); // Add theme selector
    }

    // Add theme selector to UI (NEW!)
    addThemeSelector() {
        const container = document.getElementById('themeSelector');
        if (!container) return;

        const themeSelector = this.themeManager.createThemeSelector();
        container.appendChild(themeSelector);
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
            fileInput.value = '';
        });

        // Import/Export
        const importInput = document.getElementById('importInput');
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        this.importData(data);
                    } catch (error) {
                        alert('Error importing data: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
            importInput.value = '';
        });

        // Competitive Mode Toggle
        const competitiveToggle = document.getElementById('competitiveModeToggle');
        const thresholdContainer = document.getElementById('confidenceThresholdContainer');
        const thresholdInput = document.getElementById('confidenceThreshold');
        const thresholdValue = document.getElementById('thresholdValue');

        competitiveToggle.addEventListener('change', (e) => {
            this.predictionEngine.competitiveMode = e.target.checked;
            thresholdContainer.style.display = e.target.checked ? 'block' : 'none';
            this.saveData();
        });

        thresholdInput.addEventListener('input', (e) => {
            const value = e.target.value;
            thresholdValue.textContent = value;
            this.predictionEngine.confidenceThreshold = value / 100;
            this.saveData();
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
                diceSum.textContent = `Sum: ${sum} • ${sum >= 11 ? 'BIG' : 'SMALL'} • ${sum % 2 === 0 ? 'EVEN' : 'ODD'}`;
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
                return;
            }

            if (this.periodParser.isValidPeriod(value)) {
                const formatted = this.periodParser.formatPeriodDisplay(value);
                periodValidation.textContent = `✓ Valid: ${formatted}`;
                periodValidation.style.color = 'var(--color-success)';
                this.lastPeriod = value;
            } else {
                periodValidation.textContent = '✗ Invalid format';
                periodValidation.style.color = 'var(--color-error)';
            }
        });
    }

    // Change timeframe
    changeTimeframe(newTimeframe) {
        this.saveData();
        this.currentTimeframe = newTimeframe;

        const periodInput = document.getElementById('periodInput');
        if (this.lastPeriod) {
            periodInput.value = this.lastPeriod;
            periodInput.dispatchEvent(new Event('input'));
        } else {
            periodInput.value = '';
            document.getElementById('periodValidation').textContent = '';
        }

        this.lastPrediction = null;
        this.pendingFeedback = false;
        document.getElementById('feedbackButtons').style.display = 'none';

        this.updateAllDisplays();
        this.updateCurrentGameInfo();

        const stats = this.predictionEngine.getStatistics();
        console.log(`Switched to ${newTimeframe} mode (${stats.total} entries)`);
    }

    // Update current game info display
    updateCurrentGameInfo() {
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
        if (this.pendingFeedback && this.lastPrediction) {
            const isCorrect = this.lastPrediction.number === number;
            this.learningEngine.recordFeedback(this.lastPrediction, number, isCorrect);
            this.pendingFeedback = false;
            document.getElementById('feedbackButtons').style.display = 'none';
        }

        const periodInput = document.getElementById('periodInput');
        const dice1 = parseInt(document.getElementById('dice1').value) || null;
        const dice2 = parseInt(document.getElementById('dice2').value) || null;
        const dice3 = parseInt(document.getElementById('dice3').value) || null;

        if (dice1 && dice2 && dice3) {
            const sum = dice1 + dice2 + dice3;
            if (sum !== number) {
                alert(`Dice sum (${sum}) doesn't match selected number (${number})!`);
                return;
            }
        }

        const period = periodInput.value.trim() || null;
        if (period && !this.periodParser.isValidPeriod(period)) {
            alert('Invalid period number format!');
            return;
        }

        const entry = {
            number,
            timestamp: Date.now(),
            isBig: number >= 11,
            isEven: number % 2 === 0,
            period: period,
            dice: (dice1 && dice2 && dice3) ? [dice1, dice2, dice3] : null,
            timeframe: this.currentTimeframe
        };

        this.predictionEngine.addRoll(number);
        this.predictionEngine.metadata = this.currentData.metadata;
        this.currentData.metadata.push(entry);

        if (period) {
            this.lastPeriod = period;
            const nextPeriod = this.periodParser.getNextPeriod(period, this.currentTimeframe);
            periodInput.value = nextPeriod;
            periodInput.dispatchEvent(new Event('input'));
        }

        document.getElementById('dice1').value = '';
        document.getElementById('dice2').value = '';
        document.getElementById('dice3').value = '';
        document.getElementById('diceSum').textContent = '';

        this.saveData();
        this.updateAllDisplays();
        this.updateCurrentGameInfo();
    }

    // Generate prediction
    generatePrediction() {
        this.predictionEngine.metadata = this.currentData.metadata;
        const prediction = this.predictionEngine.getPrediction();
        this.lastPrediction = prediction;
        this.pendingFeedback = true;

        const predictionNumber = document.getElementById('predictionNumber');
        const predictionType = document.getElementById('predictionType');
        const predictionParity = document.getElementById('predictionParity');
        const confidenceFill = document.getElementById('confidenceFill');
        const confidenceText = document.getElementById('confidenceText');

        if (prediction.belowThreshold) {
            predictionNumber.textContent = '⏳';
            predictionType.textContent = prediction.message;
            predictionParity.textContent = '';
            confidenceFill.style.width = `${prediction.confidence}%`;
            confidenceText.textContent = prediction.message;
            document.getElementById('feedbackButtons').style.display = 'none';
            document.getElementById('predictionExplanationCard').style.display = 'none';
            return;
        }

        predictionNumber.textContent = prediction.number;
        predictionType.innerHTML = `<span class="prediction-tag badge-${prediction.isBig ? 'error' : 'success'}">${prediction.isBig ? 'BIG (11-18)' : 'SMALL (3-10)'}</span>`;
        predictionParity.innerHTML = `<span class="prediction-tag badge-${prediction.isEven ? 'primary' : 'warning'}">${prediction.isEven ? 'EVEN' : 'ODD'}</span>`;
        confidenceFill.style.width = `${prediction.confidence}%`;
        confidenceText.textContent = `Confidence: ${prediction.confidence}% • Using ${prediction.contributors?.length || 0} algorithms`;

        document.getElementById('feedbackButtons').style.display = 'flex';

        // Show AI explanation (NEW!)
        this.showPredictionExplanation(prediction);
    }

    // Submit feedback
    submitFeedback(isCorrect) {
        if (!this.lastPrediction) return;

        this.learningEngine.feedbackHistory.push({
            timestamp: Date.now(),
            predicted: this.lastPrediction.number,
            actual: null,
            isCorrect,
            confidence: this.lastPrediction.confidence,
            contributors: this.lastPrediction.contributors || []
        });

        if (this.lastPrediction.contributors) {
            this.lastPrediction.contributors.forEach(algoName => {
                this.learningEngine.updateAlgorithmPerformance(algoName, isCorrect);
            });
        }

        this.learningEngine.adjustWeights();
        this.pendingFeedback = false;
        document.getElementById('feedbackButtons').style.display = 'none';
        this.saveData();
        this.updateAllDisplays();

        console.log(isCorrect ? '✓ Correct prediction!' : '✗ Incorrect prediction. Learning...');
    }

    // Handle image upload (OPTIMIZED!)
    async handleImageUpload(files) {
        if (files.length === 0) return;

        const progressBar = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('uploadProgressFill');
        const statusText = document.getElementById('uploadStatus');

        progressBar.style.display = 'block';
        progressFill.style.width = '0%';
        statusText.textContent = `📤 Uploading ${files.length} images...`;

        this.imageAnalyzer.setBatchProgressCallback((progress) => {
            if (progress.type === 'batch') {
                const pct = progress.progress;
                progressFill.style.width = `${pct}%`;
                statusText.textContent = `🔄 Processing ${progress.current}/${progress.total} (${progress.processed} added, ${progress.skipped} skipped)`;
            } else if (progress.type === 'ocr') {
                statusText.textContent = `🔍 OCR: ${progress.progress}%`;
            } else if (progress.type === 'complete') {
                progressFill.style.width = '100%';
                statusText.textContent = `✅ Complete! ${progress.processed} processed, ${progress.skipped} duplicates skipped, ${progress.errors} errors`;
            }
        });

        try {
            const { results, errors, skipped } = await this.imageAnalyzer.processBatch(files);

            console.log('📊 Upload Results:', { results, errors, skipped });

            // Don't hide progress bar - keep it visible
            progressBar.style.display = 'block';

            // Show what was extracted
            if (results.length === 0 && errors.length === 0) {
                alert('⚠️ No data extracted! Check console (F12) for OCR output. Make sure images show period numbers clearly.');
            } else if (results.length === 0 && errors.length > 0) {
                alert(`❌ All ${files.length} images failed OCR. Check console (F12) for details.`);
            }

            this.displayExtractedNumbers(results, errors, skipped);
        } catch (error) {
            progressBar.style.display = 'none';
            console.error('Upload Error:', error);
            alert('Error processing images: ' + error.message + '\nCheck console (F12) for details.');
        }
    }

    // Display extracted numbers from images
    displayExtractedNumbers(results, errors, skipped = 0) {
        const container = document.getElementById('extractedNumbers');
        container.innerHTML = '';

        console.log('📋 Displaying Results:', { results, errors, skipped });

        // Always create wrapper - don't return early
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-md); background: var(--color-bg-tertiary); margin-top: var(--space-md);';

        if (results.length === 0 && errors.length === 0) {
            wrapper.innerHTML = `
                <div style="text-align: center; padding: var(--space-lg); color: var(--color-warning);">
                    <div style="font-size: 2rem; margin-bottom: var(--space-sm);">⚠️</div>
                    <div style="font-weight: 700; margin-bottom: var(--space-sm);">No Data Extracted</div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
                        OCR couldn't find period numbers or sums in the images.<br>
                        Press F12 to open console and check OCR logs.<br>
                        Make sure images are clear and show the game table.
                    </div>
                </div>
            `;
            container.appendChild(wrapper);
            return;
        }

        if (results.length > 0) {
            const title = document.createElement('div');
            title.style.cssText = 'font-weight: 700; margin-bottom: var(--space-md); color: var(--color-success);';
            title.textContent = `✓ Extracted ${results.length} unique results` + (skipped > 0 ? ` (${skipped} duplicates skipped)` : '');
            wrapper.appendChild(title);

            results.forEach(game => {
                const item = document.createElement('div');
                item.style.cssText = 'margin-bottom: var(--space-sm); padding: var(--space-sm); background: var(--color-bg-card); border-radius: var(--radius-sm);';

                const diceDisplay = game.dice ? game.dice.join('-') + ' = ' : '';
                const periodDisplay = game.period ? ` • Period: ...${game.period.slice(-6)}` : ' • No Period';

                item.innerHTML = `
                    <div style="display: flex; gap: var(--space-sm); align-items: center;">
                        <span class="badge badge-${game.isBig ? 'error' : 'success'}" style="font-size: var(--font-size-lg);">${diceDisplay}${game.sum}</span>
                        <span class="badge badge-${game.isEven ? 'primary' : 'warning'}">${game.isEven ? 'EVEN' : 'ODD'}</span>
                        <span style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${periodDisplay}</span>
                    </div>
                `;
                wrapper.appendChild(item);
            });

            const addButton = document.createElement('button');
            addButton.className = 'btn btn-success mt-md';
            addButton.textContent = `Add All ${results.length} to History`;
            addButton.onclick = () => {
                results.forEach(game => {
                    this.predictionEngine.addRoll(game.sum);
                    const entry = {
                        number: game.sum,
                        timestamp: Date.now(),
                        isBig: game.isBig,
                        isEven: game.isEven,
                        period: game.period,
                        dice: game.dice,
                        timeframe: this.currentTimeframe,
                        source: 'image_upload'
                    };
                    this.currentData.metadata.push(entry);
                    if (game.period) this.lastPeriod = game.period;
                });

                this.predictionEngine.metadata = this.currentData.metadata;

                if (this.lastPeriod) {
                    const periodInput = document.getElementById('periodInput');
                    const nextPeriod = this.periodParser.getNextPeriod(this.lastPeriod, this.currentTimeframe);
                    periodInput.value = nextPeriod;
                    periodInput.dispatchEvent(new Event('input'));
                }

                this.saveData();
                this.updateAllDisplays();
                this.updateCurrentGameInfo();
                container.innerHTML = '<div style="padding: var(--space-md); text-align: center; color: var(--color-success);">✅ Successfully added ' + results.length + ' entries to history!</div>';
                console.log(`✅ Added ${results.length} entries from images`);
            };
            wrapper.appendChild(addButton);
        }

        if (errors.length > 0) {
            const errorTitle = document.createElement('div');
            errorTitle.style.cssText = 'font-weight: 700; margin-top: var(--space-md); color: var(--color-error);';
            errorTitle.textContent = `⚠ ${errors.length} errors`;
            wrapper.appendChild(errorTitle);

            errors.forEach(err => {
                const item = document.createElement('div');
                item.style.cssText = 'font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-xs);';
                item.textContent = `${err.fileName}: ${err.error}`;
                wrapper.appendChild(item);
            });
        }

        container.appendChild(wrapper);

        // Scroll to results
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update AI insights display
    refreshAIInsights() {
        const insights = this.aiInsights.generateInsights();
        const container = document.getElementById('aiInsightsContainer');

        if (insights.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">No AI insights available yet. Add more data!</p>';
            return;
        }

        container.innerHTML = insights.map(insight => {
            const colorMap = {
                success: 'var(--color-success)',
                warning: 'var(--color-warning)',
                info: 'var(--color-secondary)',
                error: 'var(--color-error)'
            };

            return `
                <div class="ai-insight" style="padding: var(--space-md); margin-bottom: var(--space-md); background: var(--color-bg-tertiary); border-left: 3px solid ${colorMap[insight.type]}; border-radius: var(--radius-sm);">
                    <div style="display: flex; align-items: flex-start; gap: var(--space-sm);">
                        <span style="font-size: 1.5rem;">${insight.icon}</span>
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 var(--space-xs) 0; color: var(--color-text); font-size: var(--font-size-base); font-weight: 600;">
                                ${insight.title}
                            </h4>
                            <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                                ${insight.message}
                            </p>
                            ${insight.confidence ? `<div style="margin-top: var(--space-xs); font-size: var(--font-size-xs); color: var(--color-text-muted);">Confidence: ${insight.confidence}%</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Show prediction explanation (NEW!)
    showPredictionExplanation(prediction) {
        const card = document.getElementById('predictionExplanationCard');
        const container = document.getElementById('predictionExplanation');

        if (!prediction || prediction.belowThreshold) {
            card.style.display = 'none';
            return;
        }

        // Generate explanation card
        const explanationCard = this.advancedAI.createExplanationCard(prediction);
        container.innerHTML = '';
        container.appendChild(explanationCard);

        // Show card with animation
        card.style.display = 'block';
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update all UI displays
    updateAllDisplays() {
        this.updateStatistics();
        this.updateHeatmap();
        this.updateHistory();
        this.updateLearningStatus();
        this.updateAlgorithmChart();
        this.refreshAIInsights(); // Add AI insights refresh
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
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: var(--space-xl); color: var(--color-text-muted);">No history yet. Add numbers to start predicting!</td></tr>`;
            return;
        }

        const recentHistory = history.slice(-50).reverse();

        tbody.innerHTML = recentHistory.map((entry, idx) => {
            const actualIdx = history.length - idx - 1;
            const meta = metadata[actualIdx] || {};

            const periodDisplay = meta.period ?
                this.periodParser.formatPeriodDisplay(meta.period).split(' ').pop() : '-';

            const diceDisplay = meta.dice ?
                meta.dice.map(d => `<span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background: var(--color-bg-tertiary); border-radius: var(--radius-sm); margin: 0 2px;">${d}</span>`).join('') : '-';

            return `
                <tr>
                    <td>${actualIdx + 1}</td>
                    <td style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${periodDisplay}</td>
                    <td style="font-weight: 700; font-size: var(--font-size-lg);">${entry.number}</td>
                    <td>${diceDisplay}</td>
                    <td><span class="badge badge-${entry.isBig ? 'error' : 'success'}">${entry.isBig ? 'Big' : 'Small'}</span></td>
                    <td><span class="badge badge-${entry.isEven ? 'primary' : 'warning'}">${entry.isEven ? 'Even' : 'Odd'}</span></td>
                    <td>-</td>
                    <td style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${this.formatTime(entry.timestamp)}</td>
                </tr>
            `;
        }).join('');
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

        Object.keys(this.timeframeData).forEach(tf => {
            const tfData = this.timeframeData[tf];
            data.timeframes[tf] = {
                history: tfData.predictionEngine.history,
                metadata: tfData.metadata,
                learningData: tfData.learningEngine.exportLearningData(),
                lastPeriod: tfData.lastPeriod,
                competitiveMode: tfData.predictionEngine.competitiveMode,
                confidenceThreshold: tfData.predictionEngine.confidenceThreshold
            };
        });

        localStorage.setItem('dicePredictionData', JSON.stringify(data));

        // Sync to Firebase cloud (if signed in)
        if (this.firebaseSync) {
            this.firebaseSync.syncToCloud().catch(err => {
                console.error('Cloud sync failed:', err);
            });
        }
    }

    loadData() {
        try {
            const saved = localStorage.getItem('dicePredictionData');
            if (!saved) return;

            const data = JSON.parse(saved);

            if (data.currentTimeframe) {
                this.currentTimeframe = data.currentTimeframe;
                document.getElementById('timeframeSelect').value = this.currentTimeframe;
            }

            if (data.timeframes) {
                Object.keys(data.timeframes).forEach(tf => {
                    const tfData = data.timeframes[tf];
                    if (tfData.history) {
                        this.timeframeData[tf].predictionEngine.loadHistory(tfData.history);
                    }
                    if (tfData.metadata) {
                        this.timeframeData[tf].metadata = tfData.metadata;
                        this.timeframeData[tf].predictionEngine.metadata = tfData.metadata;
                    }
                    if (tfData.learningData) {
                        this.timeframeData[tf].learningEngine.importLearningData(tfData.learningData);
                    }
                    if (tfData.lastPeriod) {
                        this.timeframeData[tf].lastPeriod = tfData.lastPeriod;
                    }
                    if (tfData.competitiveMode !== undefined) {
                        this.timeframeData[tf].predictionEngine.competitiveMode = tfData.competitiveMode;
                        document.getElementById('competitiveModeToggle').checked = tfData.competitiveMode;
                        document.getElementById('confidenceThresholdContainer').style.display =
                            tfData.competitiveMode ? 'block' : 'none';
                    }
                    if (tfData.confidenceThreshold !== undefined) {
                        this.timeframeData[tf].predictionEngine.confidenceThreshold = tfData.confidenceThreshold;
                        const thresholdValue = Math.round(tfData.confidenceThreshold * 100);
                        document.getElementById('confidenceThreshold').value = thresholdValue;
                        document.getElementById('thresholdValue').textContent = thresholdValue;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // Export data as JSON
    exportData() {
        const data = {
            currentTimeframe: this.currentTimeframe,
            timeframes: {},
            exportDate: new Date().toISOString()
        };

        Object.keys(this.timeframeData).forEach(tf => {
            const tfData = this.timeframeData[tf];
            data.timeframes[tf] = {
                history: tfData.predictionEngine.history,
                metadata: tfData.metadata,
                learningData: tfData.learningEngine.exportLearningData(),
                lastPeriod: tfData.lastPeriod
            };
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diceai-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import data from JSON
    importData(data) {
        if (data.timeframes) {
            Object.keys(data.timeframes).forEach(tf => {
                const tfData = data.timeframes[tf];
                if (tfData.history) {
                    this.timeframeData[tf].predictionEngine.loadHistory(tfData.history);
                }
                if (tfData.metadata) {
                    this.timeframeData[tf].metadata = tfData.metadata;
                    this.timeframeData[tf].predictionEngine.metadata = tfData.metadata;
                }
                if (tfData.learningData) {
                    this.timeframeData[tf].learningEngine.importLearningData(tfData.learningData);
                }
                if (tfData.lastPeriod) {
                    this.timeframeData[tf].lastPeriod = tfData.lastPeriod;
                }
            });

            this.saveData();
            this.updateAllDisplays();
            console.log('Data imported successfully!');
        }
    }

    // Clear all data
    clearAll() {
        if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            return;
        }

        Object.keys(this.timeframeData).forEach(tf => {
            this.timeframeData[tf].predictionEngine.clearHistory();
            this.timeframeData[tf].metadata = [];
            this.timeframeData[tf].learningEngine.clearLearningData();
            this.timeframeData[tf].lastPeriod = null;
        });

        this.lastPrediction = null;
        this.pendingFeedback = false;

        localStorage.removeItem('dicePredictionData');
        this.updateAllDisplays();
        this.updateCurrentGameInfo();

        console.log('All data cleared!');
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DicePredictionApp();
});
