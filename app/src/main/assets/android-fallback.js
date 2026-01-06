// Android WebView Fallback for Image Upload
// This script provides a simpler image upload experience for Android devices

(function () {
    // Detect if running in Android WebView
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isWebView = /wv/.test(navigator.userAgent) || window.navigator.standalone;

    if (!isAndroid || !isWebView) {
        return; // Not Android WebView, use default behavior
    }

    console.log('[Android Fallback] Initializing Android-specific image upload');

    // Override the image analyzer to show a simple manual entry interface
    class AndroidImageFallback {
        constructor() {
            this.setupAndroidUpload();
        }

        setupAndroidUpload() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                this.init();
            }
        }

        init() {
            const uploadZone = document.getElementById('uploadZone');
            const extractedNumbers = document.getElementById('extractedNumbers');
            const fileInput = document.getElementById('fileInput');

            if (!uploadZone || !fileInput) return;

            // Replace the upload hint text with Android-specific instructions
            const uploadText = uploadZone.querySelector('.upload-text');
            const uploadHint = uploadZone.querySelector('.upload-hint');

            if (uploadText) {
                uploadText.textContent = '📱 Android Gallery Upload';
                uploadText.style.fontSize = 'var(--font-size-lg)';
                uploadText.style.fontWeight = '700';
                uploadText.style.color = 'var(--color-primary)';
            }

            if (uploadHint) {
                uploadHint.textContent = 'Tap the button below to select screenshots from your gallery';
                uploadHint.style.fontSize = 'var(--font-size-sm)';
            }

            // Create a prominent "Select Photos" button
            const selectButton = document.createElement('button');
            selectButton.className = 'btn btn-primary';
            selectButton.style.cssText = `
                width: 100%;
                margin-top: var(--space-md);
                padding: var(--space-md);
                font-size: var(--font-size-base);
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-sm);
            `;
            selectButton.innerHTML = '📸 Select Photos from Gallery';
            selectButton.onclick = (e) => {
                e.stopPropagation();
                fileInput.click();
            };

            // Add the button to the upload zone
            uploadZone.appendChild(selectButton);

            // Keep the upload zone clickable as backup
            uploadZone.style.cursor = 'pointer';

            // Listen for file selection
            fileInput.addEventListener('change', (e) => {
                this.handleAndroidUpload(e.target.files, extractedNumbers);
            });
        }

        handleAndroidUpload(files, container) {
            if (!files || files.length === 0) return;

            container.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
                background: var(--color-bg-tertiary);
            `;

            const title = document.createElement('div');
            title.style.cssText = 'font-weight: 700; margin-bottom: var(--space-md); color: var(--color-primary);';
            title.textContent = `📱 ${files.length} image(s) selected - Manual Entry Mode`;
            wrapper.appendChild(title);

            const hint = document.createElement('div');
            hint.style.cssText = 'margin-bottom: var(--space-md); color: var(--color-text-secondary); font-size: var(--font-size-sm);';
            hint.textContent = 'Look at your screenshots and manually enter the data below:';
            wrapper.appendChild(hint);

            // Create manual entry form for each image
            Array.from(files).forEach((file, index) => {
                const imagePreview = this.createImagePreview(file, index);
                wrapper.appendChild(imagePreview);
            });

            container.appendChild(wrapper);
        }

        createImagePreview(file, index) {
            const container = document.createElement('div');
            container.style.cssText = `
                margin-bottom: var(--space-md);
                padding: var(--space-md);
                background: var(--color-bg-card);
                border-radius: var(--radius-sm);
                border: 1px solid var(--color-border);
            `;

            const fileName = document.createElement('div');
            fileName.style.cssText = 'font-size: var(--font-size-sm); color: var(--color-text-tertiary); margin-bottom: var(--space-sm);';
            fileName.textContent = file.name;
            container.appendChild(fileName);

            // Image preview
            const img = document.createElement('img');
            img.style.cssText = 'max-width: 100%; max-height: 200px; border-radius: var(--radius-sm); margin-bottom: var(--space-sm); display: block;';
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            container.appendChild(img);

            // Manual entry form
            const form = document.createElement('div');
            form.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); margin-top: var(--space-sm);">
                    <div>
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-text-secondary); font-size: var(--font-size-xs);">Period Number</label>
                        <input type="text" class="android-period-${index}" placeholder="e.g., 2025122910102089" style="width: 100%; padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-text-secondary); font-size: var(--font-size-xs);">Sum (3-18)</label>
                        <input type="number" class="android-sum-${index}" min="3" max="18" placeholder="Sum" style="width: 100%; padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text);">
                    </div>
                </div>
                <div style="margin-top: var(--space-sm);">
                    <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-text-secondary); font-size: var(--font-size-xs);">Individual Dice (Optional)</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-sm);">
                        <input type="number" class="android-dice1-${index}" min="1" max="6" placeholder="D1" style="padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center;">
                        <input type="number" class="android-dice2-${index}" min="1" max="6" placeholder="D2" style="padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center;">
                        <input type="number" class="android-dice3-${index}" min="1" max="6" placeholder="D3" style="padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center;">
                    </div>
                </div>
                <button class="btn btn-primary mt-sm" onclick="window.androidFallback.addEntry(${index})" style="width: 100%;">
                    ✓ Add This Entry
                </button>
            `;
            container.appendChild(form);

            return container;
        }

        addEntry(index) {
            const periodInput = document.querySelector(`.android-period-${index}`);
            const sumInput = document.querySelector(`.android-sum-${index}`);
            const dice1Input = document.querySelector(`.android-dice1-${index}`);
            const dice2Input = document.querySelector(`.android-dice2-${index}`);
            const dice3Input = document.querySelector(`.android-dice3-${index}`);

            const period = periodInput.value.trim();
            const sum = parseInt(sumInput.value);
            const dice1 = parseInt(dice1Input.value) || null;
            const dice2 = parseInt(dice2Input.value) || null;
            const dice3 = parseInt(dice3Input.value) || null;

            if (!sum || sum < 3 || sum > 18) {
                alert(' Please enter a valid sum (3-18)');
                return;
            }

            // Validate dice if provided
            if (dice1 && dice2 && dice3) {
                const diceSum = dice1 + dice2 + dice3;
                if (diceSum !== sum) {
                    alert(`❌ Dice sum (${diceSum}) doesn't match the sum you entered (${sum})`);
                    return;
                }
            }

            // Use the global app instance to add the number
            if (window.app) {
                // Set period input if provided
                if (period) {
                    const mainPeriodInput = document.getElementById('periodInput');
                    if (mainPeriodInput) {
                        mainPeriodInput.value = period;
                        mainPeriodInput.dispatchEvent(new Event('input'));
                    }
                }

                // Set dice inputs if provided
                if (dice1 && dice2 && dice3) {
                    document.getElementById('dice1').value = dice1;
                    document.getElementById('dice2').value = dice2;
                    document.getElementById('dice3').value = dice3;
                }

                // Add the number
                window.app.addNumber(sum);

                // Clear the inputs
                periodInput.value = '';
                sumInput.value = '';
                dice1Input.value = '';
                dice2Input.value = '';
                dice3Input.value = '';

                // Show success message
                alert(`✓ Added entry: Sum ${sum}` + (period ? `, Period ${period}` : ''));
            }
        }
    }

    // Initialize and expose globally
    window.androidFallback = new AndroidImageFallback();

})();
