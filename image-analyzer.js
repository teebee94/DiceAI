// =======================================
// Image Analyzer - OPTIMIZED
// Fast OCR with progress tracking
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

        // Optimized parameters
        await this.worker.setParameters({
            tessedit_char_whitelist: '0123456789 \n',  // Only digits and whitespace
            tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,  // Faster for numbers
        });

        return this.worker;
    }

    // Compress image for faster OCR  (3-5x speed improvement)
    async compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Resize to 600 px max (sweet spot for OCR speed+accuracy)
                    const maxSize = 600;
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

                    // Enhance for OCR: grayscale + high contrast
                    ctx.filter = 'grayscale(100%) contrast(150%)';
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.6);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Process single image (fast version)
    async processImage(file) {
        try {
            await this.initWorker();

            // Compress first
            const compressed = await this.compressImage(file);
            const imageUrl = await this.readFileAsDataURL(compressed);

            const { data } = await this.worker.recognize(imageUrl);

            // Extract game data
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
        const seenSums = new Set();  // Track duplicates

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
                // Add only unique results
                result.gameResults.forEach(game => {
                    const key = `${game.sum}-${game.period || 'noperiod'}`;
                    if (!seenSums.has(key)) {
                        seenSums.add(key);
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

    // Extract structured game data (improved accuracy)
    extractGameData(text) {
        const games = [];
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);

        // Find all numbers in text
        const allNumbers = text.match(/\d+/g) || [];

        // Look for period (17-19 digits)
        const period = allNumbers.find(n => n.length >= 17 && n.length <= 19);

        // Look for sum (3-18)
        const sums = allNumbers.filter(n => {
            const num = parseInt(n);
            return num >= 3 && num <= 18 && n.length <= 2;
        });

        // Look for dice (three consecutive 1-6)
        let dice = null;
        for (let i = 0; i < allNumbers.length - 2; i++) {
            const d1 = parseInt(allNumbers[i]);
            const d2 = parseInt(allNumbers[i + 1]);
            const d3 = parseInt(allNumbers[i + 2]);

            if (d1 >= 1 && d1 <= 6 && d2 >= 1 && d2 <= 6 && d3 >= 1 && d3 <= 6) {
                dice = [d1, d2, d3];
                break;
            }
        }

        // Build game result
        if (sums.length > 0) {
            const sum = parseInt(sums[0]);  // Take first valid sum
            const calcSum = dice ? dice.reduce((a, b) => a + b, 0) : sum;

            games.push({
                period: period || null,
                sum: dice ? calcSum : sum,  // Use calculated sum if we have dice
                dice: dice,
                isBig: calcSum >= 11,
                isEven: calcSum % 2 === 0
            });
        } else if (dice) {
            // No sum found but have dice
            const calcSum = dice.reduce((a, b) => a + b, 0);
            games.push({
                period: period || null,
                sum: calcSum,
                dice: dice,
                isBig: calcSum >= 11,
                isEven: calcSum % 2 === 0
            });
        }

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
