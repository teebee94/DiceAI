// Enhanced Android WebView Image Upload
// Improved UI, better instructions, smoother workflow

(function () {
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (!isAndroid) {
        console.log('[Android Fallback] Not Android - skipping');
        return;
    }

    console.log('[Android Fallback] 🤖 Initializing enhanced Android upload');

    class AndroidImageFallback {
        constructor() {
            this.setupAndroidUpload();
        }

        setupAndroidUpload() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                setTimeout(() => this.init(), 100);
            }
        }

        init() {
            console.log('[Android Fallback] 🎨 Enhancing UI...');

            const uploadZone = document.getElementById('uploadZone');
            const extractedNumbers = document.getElementById('extractedNumbers');
            const fileInput = document.getElementById('fileInput');

            if (!uploadZone || !fileInput) {
                console.error('[Android Fallback] Required elements not found!');
                return;
            }

            // Enhanced upload zone with better styling
            uploadZone.innerHTML = '';
            uploadZone.style.cssText = `
                padding: var(--space-lg);
                border: 2px dashed var(--color-primary);
                border-radius: var(--radius-lg);
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            // Big camera icon
            const icon = document.createElement('div');
            icon.textContent = '📸';
            icon.style.cssText = 'font-size: 48px; margin-bottom: var(--space-md); animation: pulse 2s infinite;';
            uploadZone.appendChild(icon);

            // Title
            const title = document.createElement('div');
            title.textContent = '🤖 Android Quick Upload';
            title.style.cssText = 'font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-sm);';
            uploadZone.appendChild(title);

            // Instructions
            const instructions = document.createElement('div');
            instructions.textContent = 'Select screenshots from your gallery, then quickly enter the data you see';
            instructions.style.cssText = 'font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md); line-height: 1.5;';
            uploadZone.appendChild(instructions);

            // Enhanced button with animation
            const selectButton = document.createElement('button');
            selectButton.className = 'btn btn-primary';
            selectButton.type = 'button';
            selectButton.style.cssText = `
                width: 100%;
                max-width: 400px;
                padding: var(--space-md) var(--space-xl);
                font-size: var(--font-size-lg);
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-sm);
                background: linear-gradient(135deg, var(--color-primary), #3b82f6);
                color: white;
                border: none;
                border-radius: var(--radius-lg);
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                transition: all 0.3s ease;
                transform: scale(1);
            `;
            selectButton.innerHTML = '📱 Open Gallery & Select Photos';

            selectButton.onmouseenter = () => {
                selectButton.style.transform = 'scale(1.05)';
                selectButton.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
            };

            selectButton.onmouseleave = () => {
                selectButton.style.transform = 'scale(1)';
                selectButton.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            };

            selectButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Android Fallback] 🚀 Opening gallery picker...');
                fileInput.click();
            };

            uploadZone.appendChild(selectButton);

            // Quick tips
            const tips = document.createElement('div');
            tips.style.cssText = 'margin-top: var(--space-md); padding: var(--space-sm); background: rgba(59, 130, 246, 0.1); border-radius: var(--radius-sm); font-size: var(--font-size-xs); color: var(--color-text-secondary);';
            tips.innerHTML = '💡 <strong>Tip:</strong> You can select multiple screenshots at once!';
            uploadZone.appendChild(tips);

            // Whole zone clickable
            uploadZone.onclick = (e) => {
                if (e.target !== selectButton) {
                    fileInput.click();
                }
            };

            console.log('[Android Fallback] ✅ UI enhanced!');

            // File selection handler
            fileInput.addEventListener('change', (e) => {
                console.log('[Android Fallback] 📷 Files selected:', e.target.files.length);
                this.handleAndroidUpload(e.target.files, extractedNumbers);
            });

            fileInput.setAttribute('accept', 'image/*');
            fileInput.setAttribute('multiple', 'multiple');

            // Add pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }

        handleAndroidUpload(files, container) {
            if (!files || files.length === 0) {
                console.log('[Android Fallback] No files selected');
                return;
            }

            console.log('[Android Fallback] 🎯 Processing', files.length, 'files');
            container.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                border: 2px solid var(--color-primary);
                border-radius: var(--radius-xl);
                padding: var(--space-lg);
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
                margin-top: var(--space-lg);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            `;

            const header = document.createElement('div');
            header.style.cssText = 'text-align: center; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 2px solid var(--color-border);';
            header.innerHTML = `
                <div style="font-size: 32px; margin-bottom: var(--space-sm);">🎯</div>
                <div style="font-weight: 700; font-size: var(--font-size-lg); color: var(--color-primary); margin-bottom: var(--space-xs);">
                    ${files.length} Screenshot${files.length > 1 ? 's' : ''} Selected
                </div>
                <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                    Enter the data from each image below
                </div>
            `;
            wrapper.appendChild(header);

            // Create entry for each image
            Array.from(files).forEach((file, index) => {
                const imagePreview = this.createEnhancedImagePreview(file, index, files.length);
                wrapper.appendChild(imagePreview);
            });

            // Add "Add All" summary button at the end if multiple files
            if (files.length > 1) {
                const summaryButton = document.createElement('button');
                summaryButton.className = 'btn btn-primary';
                summaryButton.type = 'button';
                summaryButton.style.cssText = 'width: 100%; padding: var(--space-md); font-weight: 700; font-size: var(--font-size-base); margin-top: var(--space-md);';
                summaryButton.innerHTML = `✨ Quick Add All ${files.length} Entries`;
                summaryButton.onclick = () => {
                    for (let i = 0; i < files.length; i++) {
                        const sum = document.querySelector(`.android-sum-${i}`).value;
                        if (sum && parseInt(sum) >= 3 && parseInt(sum) <= 18) {
                            this.addEntry(i);
                        }
                    }
                };
                wrapper.appendChild(summaryButton);
            }

            container.appendChild(wrapper);

            // Auto-focus first input
            setTimeout(() => {
                const firstInput = document.querySelector('.android-sum-0');
                if (firstInput) firstInput.focus();
            }, 300);
        }

        createEnhancedImagePreview(file, index, totalFiles) {
            const container = document.createElement('div');
            container.style.cssText = `
                margin-bottom: var(--space-lg);
                padding: var(--space-lg);
                background: var(--color-bg-card);
                border-radius: var(--radius-lg);
                border: 2px solid var(--color-border);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
            `;

            container.onmouseenter = () => {
                container.style.borderColor = 'var(--color-primary)';
                container.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.2)';
            };

            container.onmouseleave = () => {
                container.style.borderColor = 'var(--color-border)';
                container.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            };

            // Header with number
            const header = document.createElement('div');
            header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);';
            header.innerHTML = `
                <div style="font-weight: 700; color: var(--color-primary); font-size: var(--font-size-base);">
                    📷 Screenshot ${index + 1} of ${totalFiles}
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">
                    ${file.name}
                </div>
            `;
            container.appendChild(header);

            // Image preview - larger and centered
            const img = document.createElement('img');
            img.style.cssText = `
                width: 100%;
                max-height: 300px;
                object-fit: contain;
                border-radius: var(--radius-md);
                margin-bottom: var(--space-md);
                display: block;
                background: rgba(0, 0, 0, 0.02);
                border: 1px solid var(--color-border);
            `;
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            container.appendChild(img);

            // Enhanced form with better layout
            const form = document.createElement('div');
            form.innerHTML = `
                <div style="display: grid; gap: var(--space-md);">
                    <!-- Period -->
                    <div>
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-text); font-weight: 600; font-size: var(--font-size-sm);">
                            🔢 Period Number
                        </label>
                        <input type="text" class="android-period-${index}" placeholder="e.g., 2025122910102089" 
                            style="width: 100%; padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text); font-size: var(--font-size-base); transition: border-color 0.3s ease;"
                            onfocus="this.style.borderColor='var(--color-primary)'" 
                            onblur="this.style.borderColor='var(--color-border)'">
                    </div>
                    
                    <!-- Sum (Most Important) -->
                    <div>
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-primary); font-weight: 700; font-size: var(--font-size-base);">
                            🎯 Sum (3-18) *Required
                        </label>
                        <input type="number" class="android-sum-${index}" min="3" max="18" placeholder="Enter sum" 
                            style="width: 100%; padding: var(--space-lg); border: 3px solid var(--color-primary); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text); font-size: var(--font-size-xl); font-weight: 700; text-align: center; transition: all 0.3s ease;"
                            onfocus="this.style.boxShadow='0 0 0 4px rgba(139, 92, 246, 0.2)'" 
                            onblur="this.style.boxShadow='none'"
                            onkeypress="if(event.key==='Enter') window.androidFallback.addEntry(${index})">
                    </div>
                    
                    <!-- Dice (Optional) -->
                    <div>
                        <label style="display: block; margin-bottom: var(--space-xs); color: var(--color-text-secondary); font-weight: 600; font-size: var(--font-size-sm);">
                            🎲 Individual Dice (Optional)
                        </label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-sm);">
                            <input type="number" class="android-dice1-${index}" min="1" max="6" placeholder="Die 1" 
                                style="padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center; font-size: var(--font-size-base); font-weight: 600;"
                                onfocus="this.style.borderColor='var(--color-primary)'" 
                                onblur="this.style.borderColor='var(--color-border)'">
                            <input type="number" class="android-dice2-${index}" min="1" max="6" placeholder="Die 2" 
                                style="padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center; font-size: var(--font-size-base); font-weight: 600;"
                                onfocus="this.style.borderColor='var(--color-primary)'" 
                                onblur="this.style.borderColor='var(--color-border)'">
                            <input type="number" class="android-dice3-${index}" min="1" max="6" placeholder="Die 3" 
                                style="padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text); text-align: center; font-size: var(--font-size-base); font-weight: 600;"
                                onfocus="this.style.borderColor='var(--color-primary)'" 
                                onblur="this.style.borderColor='var(--color-border)'">
                        </div>
                    </div>
                    
                    <!-- Submit Button -->
                    <button class="btn btn-primary" type="button" onclick="window.androidFallback.addEntry(${index})" 
                        style="width: 100%; padding: var(--space-lg); font-weight: 700; font-size: var(--font-size-lg); background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: var(--radius-lg); color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                        ✅ Add Entry #${index + 1}
                    </button>
                </div>
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
                sumInput.focus();
                return;
            }

            // Validate dice if provided
            if (dice1 && dice2 && dice3) {
                const diceSum = dice1 + dice2 + dice3;
                if (diceSum !== sum) {
                    alert(`❌ Dice sum (${diceSum}) doesn't match the sum (${sum})`);
                    return;
                }
            }

            if (window.app) {
                if (period) {
                    const mainPeriodInput = document.getElementById('periodInput');
                    if (mainPeriodInput) {
                        mainPeriodInput.value = period;
                        mainPeriodInput.dispatchEvent(new Event('input'));
                    }
                }

                if (dice1 && dice2 && dice3) {
                    document.getElementById('dice1').value = dice1;
                    document.getElementById('dice2').value = dice2;
                    document.getElementById('dice3').value = dice3;
                }

                window.app.addNumber(sum);

                // Clear inputs
                periodInput.value = '';
                sumInput.value = '';
                dice1Input.value = '';
                dice2Input.value = '';
                dice3Input.value = '';

                // Visual success feedback
                const successMsg = document.createElement('div');
                successMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #10b981, #059669); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-xl); font-size: var(--font-size-lg); font-weight: 700; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); z-index: 10000; animation: fadeInOut 2s ease;';
                successMsg.textContent = `✅ Added: ${sum}` + (period ? ` (Period ${period})` : '');
                document.body.appendChild(successMsg);

                setTimeout(() => {
                    document.body.removeChild(successMsg);
                }, 2000);

                // Focus next input if exists
                const nextSum = document.querySelector(`.android-sum-${index + 1}`);
                if (nextSum) {
                    nextSum.focus();
                }
            }
        }
    }

    window.androidFallback = new AndroidImageFallback();
    console.log('[Android Fallback] 🚀 Enhanced Android upload ready!');

    // Add fade animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
})();
