// =======================================
// Image Analyzer
// OCR-based image analysis for data entry
// =======================================

class ImageAnalyzer {
    constructor() {
        this.worker = null;
        this.progressCallback = null;
    }

    // Initialize Tesseract worker
    async initWorker() {
        if (this.worker) return this.worker;

        this.worker = await Tesseract.createWorker({
            logger: m => {
                if (m.status === 'recognizing text') {
                    console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`);
                }
            }
        });

        await this.worker.loadLanguage('eng');
        await this.worker.initialize('eng');
        await this.worker.setParameters({
            tessedit_char_whitelist: '0123456789',
        });

        return this.worker;
    }

    // Process single image
    async processImage(file) {
        try {
            await this.initWorker();

            const imageUrl = await this.readFileAsDataURL(file);
            const { data } = await this.worker.recognize(imageUrl);

            // Extract numbers from OCR text
            const text = data.text;
            const numbers = this.extractNumbers(text);
            const gameResults = this.extractGameData(text);

            return {
                fileName: file.name,
                text: text,
                numbers: numbers,
                gameResults: gameResults,
                success: numbers.length > 0 || gameResults.length > 0
            };
        } catch (error) {
            return {
                fileName: file.name,
                error: error.message,
                success: false
            };
        }
    }

    // Process batch of images
    async processBatch(files) {
        const results = [];
        const errors = [];

        for (let i = 0; i < files.length; i++) {
            if (this.progressCallback) {
                this.progressCallback(i, files.length);
            }

            const result = await this.processImage(files[i]);

            if (result.success) {
                results.push(result);
            } else {
                errors.push({
                    fileName: result.fileName,
                    error: result.error || 'No numbers found'
                });
            }
        }

        return { results, errors };
    }

    // Extract simple numbers (3-18) from text
    extractNumbers(text) {
        const numbers = [];
        const lines = text.split('\n');

        for (const line of lines) {
            // Look for standalone numbers
            const matches = line.match(/\b(3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18)\b/g);
            if (matches) {
                matches.forEach(match => {
                    const num = parseInt(match);
                    if (num >= 3 && num <= 18) {
                        numbers.push(num);
                    }
                });
            }
        }

        return [...new Set(numbers)]; // Remove duplicates
    }

    // Extract structured game data (period, dice, sum, big/small, even/odd)
    extractGameData(text) {
        const games = [];
        const lines = text.split('\n');

        // Look for period numbers (YYYYMMDDHHMMSSXXX format)
        const periodRegex = /(\d{17,19})/g;
        const periods = [...text.matchAll(periodRegex)].map(m => m[1]);

        // Look for dice patterns like [1,2,3] or 1-2-3 or 1 2 3
        const dicePatterns = [
            /\[(\d),\s*(\d),\s*(\d)\]/g,  // [1,2,3]
            /(\d)-(\d)-(\d)/g,             // 1-2-3
            /Dice:\s*(\d)\s+(\d)\s+(\d)/gi, // Dice: 1 2 3
        ];

        for (const pattern of dicePatterns) {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                const d1 = parseInt(match[1]);
                const d2 = parseInt(match[2]);
                const d3 = parseInt(match[3]);

                if (d1 >= 1 && d1 <= 6 && d2 >= 1 && d2 <= 6 && d3 >= 1 && d3 <= 6) {
                    const sum = d1 + d2 + d3;
                    const isBig = sum >= 11;
                    const isEven = sum % 2 === 0;

                    games.push({
                        dice: [d1, d2, d3],
                        sum: sum,
                        isBig: isBig,
                        isEven: isEven,
                        period: periods.shift() || null // Match with period if available
                    });
                }
            });
        }

        // If we found periods but no dice, try to extract sums directly
        if (periods.length > 0 && games.length === 0) {
            const sumMatches = text.match(/Sum:\s*(\d+)/gi) ||
                text.match(/Total:\s*(\d+)/gi) ||
                text.match(/Result:\s*(\d+)/gi);

            if (sumMatches) {
                sumMatches.forEach((match, idx) => {
                    const sum = parseInt(match.replace(/\D/g, ''));
                    if (sum >= 3 && sum <= 18) {
                        games.push({
                            dice: null,
                            sum: sum,
                            isBig: sum >= 11,
                            isEven: sum % 2 === 0,
                            period: periods[idx] || null
                        });
                    }
                });
            }
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

    // Set progress callback for batch processing
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
