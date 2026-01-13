// =======================================
// Image Analyzer - GAME FORMAT SPECIFIC
// Optimized for lottery game format
// =======================================

class ImageAnalyzer {
    constructor() {
        this.worker = null;
        this.progressCallback = null;
    }

    // Initialize Tesseract worker with optimized settings
    async initWorker() {
        if (this.worker) return this.worker;

        this.worker = await Tesseract.createWorker({
            logger: m => {
                if (m.status === 'recognizing text' && this.progressCallback) {
                    this.progressCallback({
                        type: 'ocr',
                        progress: Math.round(m.progress * 100)
                    });
                }
            }
        });

        await this.worker.loadLanguage('eng');
        await this.worker.initialize('eng');

        // Optimized for numbers only
        await this.worker.setParameters({
            tessedit_char_whitelist: '0123456789',
            tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
        });

        return this.worker;
    }

    // Compress image for faster OCR
    async compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Resize to 800px for better OCR of small text
                    const maxSize = 800;
                    let { width, height } = img;

                    if (width > height && width > maxSize) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // High contrast for better OCR
                    ctx.filter = 'grayscale(100%) contrast(200%)';
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.7);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Process single image
    async processImage(file) {
        try {
            await this.initWorker();

            const compressed = await this.compressImage(file);
            const imageUrl = await this.readFileAsDataURL(compressed);

            const { data } = await this.worker.recognize(imageUrl);

            // Extract game data using SPECIFIC format
            const gameResults = this.extractGameData(data.text);

            return {
                fileName: file.name,
                text: data.text,
                gameResults: gameResults,
                success: gameResults.length > 0
            };
        } catch (error) {
            return {
                fileName: file.name,
                error: error.message,
                success: false
            };
        }
    }

    // Process batch with real-time progress
    async processBatch(files) {
        const results = [];
        const errors = [];
        const total = files.length;
        let processed = 0;
        let skipped = 0;
        const seenPeriods = new Set();  // Track by period to avoid duplicates

        for (let i = 0; i < files.length; i++) {
            if (this.progressCallback) {
                this.progressCallback({
                    type: 'batch',
                    current: i + 1,
                    total: total,
                    progress: Math.round(((i + 1) / total) * 100),
                    processed: processed,
                    skipped: skipped
                });
            }

            const result = await this.processImage(files[i]);

            if (result.success && result.gameResults.length > 0) {
                // Add only unique periods
                result.gameResults.forEach(game => {
                    if (game.period && !seenPeriods.has(game.period)) {
                        seenPeriods.add(game.period);
                        results.push(game);
                        processed++;
                    } else if (!game.period) {
                        // No period, still add but might be duplicate
                        results.push(game);
                        processed++;
                    } else {
                        skipped++;
                    }
                });
            } else {
                errors.push({
                    fileName: result.fileName,
                    error: result.error || 'No game data found'
                });
            }
        }

        if (this.progressCallback) {
            this.progressCallback({
                type: 'complete',
                total: total,
                processed: processed,
                skipped: skipped,
                errors: errors.length
            });
        }

        return { results, errors, skipped };
    }

    // Extract game data - SPECIALIZED for your game format
    extractGameData(text) {
        const games = [];

        // Extract all numbers from text
        const allNumbers = text.match(/\d+/g) || [];

        console.log('OCR Text:', text);
        console.log('All numbers found:', allNumbers);

        // Find periods (17-18 digits: YYYYMMDDHHMMSSID)
        // Format: 2025 12 29 10 10 20 280 = 20251229101020280 (17 digits)
        const periods = allNumbers.filter(n => n.length >= 17 && n.length <= 18);

        console.log('Periods found:', periods);

        if (periods.length === 0) {
            console.log('No periods found - looking for partial matches');
            // Try to find 14+ digit numbers that might be truncated periods
            const partialPeriods = allNumbers.filter(n => n.length >= 14 && n.length <= 18);
            if (partialPeriods.length > 0) {
                periods.push(...partialPeriods);
            }
        }

        // Extract sums (numbers 3-18 that are 1-2 digits)
        const sums = allNumbers.filter(n => {
            const num = parseInt(n);
            return n.length <= 2 && num >= 3 && num <= 18;
        });

        console.log('Sums found:', sums);

        // Extract potential dice values (1-6, single digit)
        const diceValues = allNumbers.filter(n => {
            const num = parseInt(n);
            return n.length === 1 && num >= 1 && num <= 6;
        });

        console.log('Dice values found:', diceValues);

        // Match period with sum and dice
        periods.forEach((period, index) => {
            const sum = sums[index] ? parseInt(sums[index]) : null;

            // Try to find 3 consecutive dice values for this entry
            let dice = null;
            const diceStartIdx = index * 3;
            if (diceStartIdx + 2 < diceValues.length) {
                const d1 = parseInt(diceValues[diceStartIdx]);
                const d2 = parseInt(diceValues[diceStartIdx + 1]);
                const d3 = parseInt(diceValues[diceStartIdx + 2]);

                // Verify dice sum matches
                if (sum && (d1 + d2 + d3 === sum)) {
                    dice = [d1, d2, d3];
                } else {
                    // Sum doesn't match, still use dice but recalculate
                    dice = [d1, d2, d3];
                }
            }

            // If we have sum or dice, create entry
            const finalSum = dice ? dice.reduce((a, b) => a + b, 0) : sum;

            if (finalSum) {
                games.push({
                    period: period,
                    sum: finalSum,
                    dice: dice,
                    isBig: finalSum >= 11,
                    isEven: finalSum % 2 === 0
                });
            }
        });

        // If no periods found but we have sums, create entries without periods
        if (games.length === 0 && sums.length > 0) {
            console.log('No periods, but found sums - creating entries without periods');
            sums.forEach((sumStr, index) => {
                const sum = parseInt(sumStr);

                // Try to find matching dice
                let dice = null;
                const diceStartIdx = index * 3;
                if (diceStartIdx + 2 < diceValues.length) {
                    const d1 = parseInt(diceValues[diceStartIdx]);
                    const d2 = parseInt(diceValues[diceStartIdx + 1]);
                    const d3 = parseInt(diceValues[diceStartIdx + 2]);

                    if (d1 + d2 + d3 === sum) {
                        dice = [d1, d2, d3];
                    }
                }

                games.push({
                    period: null,
                    sum: sum,
                    dice: dice,
                    isBig: sum >= 11,
                    isEven: sum % 2 === 0
                });
            });
        }

        console.log('Final extracted games:', games);
        return games;
    }

    // Read file as data URL
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Set progress callback
    setBatchProgressCallback(callback) {
        this.progressCallback = callback;
    }

    // Terminate worker
    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
            this.worker = null;
        }
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageAnalyzer;
}
