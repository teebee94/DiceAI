// Android WebView Fallback for Image Upload
// This script provides a simpler image upload experience for Android devices

(function () {
    // Detect if running on Android (more robust detection)
    const isAndroid = /Android/i.test(navigator.userAgent);

    // FOR NOW: Always enable on Android, regardless of WebView detection
    // This ensures it works even if WebView detection fails
    if (!isAndroid) {
        console.log('[Android Fallback] Not Android - skipping');
        return;
    }

    console.log('[Android Fallback] Android detected! Initializing gallery upload feature');

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
                // DOM is already ready, run immediately
                setTimeout(() => this.init(), 100); // Small delay to ensure all elements are loaded
            }
        }

        init() {
            console.log('[Android Fallback] Initializing UI modifications...');

            const uploadZone = document.getElementById('uploadZone');
            const extractedNumbers = document.getElementById('extractedNumbers');
            const fileInput = document.getElementById('fileInput');

            if (!uploadZone) {
                console.error('[Android Fallback] uploadZone not found!');
                return;
            }

            if (!fileInput) {
                console.error('[Android Fallback] fileInput not found!');
                return;
            }

            console.log('[Android Fallback] Elements found, modifying UI...');

            // Clear existing content and rebuild
            uploadZone.innerHTML = '';

            // Add icon
            const icon = document.createElement('div');
            icon.className = 'upload-icon';
            icon.textContent = '📸';
            uploadZone.appendChild(icon);

            // Add title
            const title = document.createElement('div');
            title.className = 'upload-text';
            title.textContent = '📱 Android Gallery Upload';
            title.style.cssText = 'font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary); margin: var(--space-md) 0;';
            uploadZone.appendChild(title);

            // Add hint
            const hint = document.createElement('div');
            hint.className = 'upload-hint';
            hint.textContent = 'Tap the button below to select screenshots';
            hint.style.cssText = 'font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md);';
            uploadZone.appendChild(hint);

            // Create the big SELECT PHOTOS button
            const selectButton = document.createElement('button');
            selectButton.className = 'btn btn-primary';
            selectButton.type = 'button';
            selectButton.style.cssText = `
                width: 100%;
                padding: var(--space-md) var(--space-lg);
                font-size: var(--font-size-base);
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-sm);
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                cursor: pointer;
                margin-top: var(--space-md);
            `;
            selectButton.innerHTML = '📸 Select Photos from Gallery';

            // Button click handler
            selectButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Android Fallback] Button clicked! Opening file picker...');
                fileInput.click();
            };

            uploadZone.appendChild(selectButton);

            // Also make the whole upload zone clickable as backup
            uploadZone.onclick = (e) => {
                if (e.target !== selectButton) {
                    console.log('[Android Fallback] Upload zone clicked! Opening file picker...');
                    fileInput.click();
                }
            };
            uploadZone.style.cursor = 'pointer';

            console.log('[Android Fallback] UI modifications complete!');

            // Listen for file selection
            fileInput.addEventListener('change', (e) => {
                console.log('[Android Fallback] Files selected:', e.target.files.length);
                this.handleAndroidUpload(e.target.files, extractedNumbers);
            });

            // Ensure file input accepts images and allows multiple selection
            fileInput.setAttribute('accept', 'image/*');
            fileInput.setAttribute('multiple', 'multiple');
        }

        handleAndroidUpload(files, container) {
            if (!files || files.length === 0) {
                console.log('[Android Fallback] No files selected');
                return;
            }

            console.log('[Android Fallback] Processing', files.length, 'files');
            container.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
                background: var(--color-bg-tertiary);
                margin-top: var(--space-md);
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
                        <input type="text" class="android-period-${index}" placeholder="e.g., 2025122910102089" style="width: 100%; padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); font-size: var(--font-size-sm);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-text-secondary); font-size: var(--font-size-xs);">Sum (3-18)</label>
                        <input type="number" class="android-sum-${index}" min="3" max="18" placeholder="Sum" style="width: 100%; padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); font-size: var(--font-size-sm);">
                    </div>
                </div>
                <div style="margin-top: var(--space-sm);">
                    <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-text-secondary); font-size: var(--font-size-xs);">Individual Dice (Optional)</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-sm);">
                        <input type="number" class="android-dice1-${index}" min="1" max="6" placeholder="D1" style="padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center; font-size: var(--font-size-sm);">
                        <input type="number" class="android-dice2-${index}" min="1" max="6" placeholder="D2" style="padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center; font-size: var(--font-size-sm);">
                        <input type="number" class="android-dice3-${index}" min="1" max="6" placeholder="D3" style="padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center; font-size: var(--font-size-sm);">
                    </div>
                </div>
                <button class="btn btn-primary" type="button" onclick="window.androidFallback.addEntry(${index})" style="width: 100%; margin-top: var(--space-md); padding: var(--space-md); font-weight: 700;">
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
                alert('❌ Please enter a valid sum (3-18)');
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
    console.log('[Android Fallback] Initialization complete!');

})();
