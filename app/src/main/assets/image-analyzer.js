// =======================================
// Image Analysis & OCR System
// Bulk Data Import from Screenshots
// =======================================

class ImageAnalyzer {
    constructor() {
        this.tesseractInstance = null;
        this.processing = false;
        this.supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    }

    // Initialize Tesseract.js
    async initialize() {
        if (this.tesseractInstance) return;

        try {
            this.tesseractInstance = await Tesseract.createWorker({
                logger: m => {
                    if (m.status === 'recognizing text') {
                        this.onProgress && this.onProgress(m.progress);
                    }
                }
            });

            await this.tesseractInstance.loadLanguage('eng');
            await this.tesseractInstance.initialize('eng');
            await this.tesseractInstance.setParameters({
                tessedit_char_whitelist: '0123456789',
                tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT
            });

            return true;
        } catch (error) {
            console.error('Tesseract initialization failed:', error);
            return false;
        }
    }

    // Process single image and extract structured game results
    async processImage(file) {
        if (!this.supportedFormats.includes(file.type)) {
            throw new Error('Unsupported file format. Please use PNG, JPG, or WebP.');
        }

        if (!this.tesseractInstance) {
            const initialized = await this.initialize();
            if (!initialized) {
                throw new Error('OCR engine failed to initialize');
            }
        }

        this.processing = true;

        try {
            // Read file as data URL
            const imageData = await this.readFileAsDataURL(file);

            // Preprocess image for better OCR
            const preprocessed = await this.preprocessImage(imageData);

            // Perform OCR
            const { data } = await this.tesseractInstance.recognize(preprocessed);

            // Extract structured game results
            const gameResults = this.parseGameResults(data.text);

            this.processing = false;

            return {
                success: true,
                results: gameResults,
                rawText: data.text,
                confidence: data.confidence,
                fileName: file.name
            };
        } catch (error) {
            this.processing = false;
            throw error;
        }
    }

    // Parse OCR text into structured game results
    parseGameResults(text) {
        const results = [];
        const numbers = text.match(/\d+/g);

        if (!numbers || numbers.length < 5) {
            return results;
        }

        // Try to identify period numbers (14-17 digits) and sums (3-18)
        let currentPeriod = null;
        let dice = [];

        for (let i = 0; i < numbers.length; i++) {
            const num = numbers[i];
            const numInt = parseInt(num);

            // Period number (14+ digits)
            if (num.length >= 14) {
                if (currentPeriod && dice.length >= 3) {
                    // Save previous result
                    const sum = dice.slice(0, 3).reduce((a, b) => a + b, 0);
                    results.push({
                        period: currentPeriod,
                        dice: dice.slice(0, 3),
                        sum: sum,
                        isBig: sum >= 11,
                        isEven: sum % 2 === 0
                    });
                    dice = [];
                }
                currentPeriod = num;
            }
            // Dice values (1-6)
            else if (numInt >= 1 && numInt <= 6 && dice.length < 3) {
                dice.push(numInt);
            }
            // Sum total (3-18) - use this if we have period but no dice
            else if (numInt >= 3 && numInt <= 18 && currentPeriod && dice.length === 0) {
                // Estimate dice from sum (we don't know actual dice)
                const avgDice = Math.round(numInt / 3);
                dice = [avgDice, avgDice, numInt - (avgDice * 2)];
            }
        }

        // Add last result if exists
        if (currentPeriod && dice.length >= 3) {
            const sum = dice.slice(0, 3).reduce((a, b) => a + b, 0);
            results.push({
                period: currentPeriod,
                dice: dice.slice(0, 3),
                sum: sum,
                isBig: sum >= 11,
                isEven: sum % 2 === 0
            });
        }

        return results;
    }

    // Process multiple images
    async processBatch(files) {
        const allResults = [];
        const errors = [];

        for (let i = 0; i < files.length; i++) {
            try {
                this.onBatchProgress && this.onBatchProgress(i, files.length);
                const result = await this.processImage(files[i]);
                if (result.results && result.results.length > 0) {
                    allResults.push(...result.results);
                }
            } catch (error) {
                errors.push({
                    fileName: files[i].name,
                    error: error.message
                });
            }
        }

        return { results: allResults, errors };
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

    // Preprocess image for better OCR accuracy
    async preprocessImage(imageData) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set canvas size
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image
                ctx.drawImage(img, 0, 0);

                // Get image data
                const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageDataObj.data;

                // Increase contrast and convert to grayscale
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

                    // Increase contrast
                    const contrasted = ((brightness - 128) * 1.5) + 128;

                    // Apply threshold for better OCR
                    const value = contrasted > 128 ? 255 : 0;

                    data[i] = value;     // R
                    data[i + 1] = value; // G
                    data[i + 2] = value; // B
                }

                ctx.putImageData(imageDataObj, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.src = imageData;
        });
    }

    // Cleanup
    async terminate() {
        if (this.tesseractInstance) {
            await this.tesseractInstance.terminate();
            this.tesseractInstance = null;
        }
    }

    // Set progress callback
    setProgressCallback(callback) {
        this.onProgress = callback;
    }

    // Set batch progress callback
    setBatchProgressCallback(callback) {
        this.onBatchProgress = callback;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageAnalyzer;
}
