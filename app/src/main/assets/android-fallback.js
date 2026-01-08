// Hybrid Bulk Entry System for Android
// Shows screenshot + rapid entry form for 10-15 results per image
// Press Enter to quickly add each result

(function () {
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (!isAndroid) {
        console.log('[Bulk Entry] Not Android - skipping');
        return;
    }

    console.log('[Bulk Entry] 🚀 Initializing hybrid bulk entry system');

    class BulkEntrySystem {
        constructor() {
            this.currentImageIndex = 0;
            this.totalImages = 0;
            this.setupBulkEntry();
        }

        setupBulkEntry() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                setTimeout(() => this.init(), 100);
            }
        }

        init() {
            console.log('[Bulk Entry] Initializing UI...');

            const uploadZone = document.getElementById('uploadZone');
            const extractedNumbers = document.getElementById('extractedNumbers');
            const fileInput = document.getElementById('fileInput');

            if (!uploadZone || !fileInput) {
                console.error('[Bulk Entry] Required elements not found!');
                return;
            }

            // Style the upload zone
            uploadZone.innerHTML = '';
            uploadZone.style.cssText = `
                padding: var(--space-xl);
                border: 3px dashed var(--color-primary);
                border-radius: var(--radius-xl);
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08));
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            // Icon
            const icon = document.createElement('div');
            icon.textContent = '📊';
            icon.style.cssText = 'font-size: 64px; margin-bottom: var(--space-md);';
            uploadZone.appendChild(icon);

            // Title
            const title = document.createElement('div');
            title.textContent = 'Bulk Data Entry';
            title.style.cssText = 'font-size: var(--font-size-xxl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-sm);';
            uploadZone.appendChild(title);

            // Subtitle
            const subtitle = document.createElement('div');
            subtitle.textContent = 'Upload screenshots with 10-15 results each';
            subtitle.style.cssText = 'font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: var(--space-lg);';
            uploadZone.appendChild(subtitle);

            // Upload button
            const uploadBtn = document.createElement('button');
            uploadBtn.className = 'btn btn-primary';
            uploadBtn.type = 'button';
            uploadBtn.style.cssText = `
                padding: var(--space-lg) var(--space-xxl);
                font-size: var(--font-size-lg);
                font-weight: 700;
                background: linear-gradient(135deg, var(--color-primary), #3b82f6);
                border: none;
                border-radius: var(--radius-lg);
                box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
            `;
            uploadBtn.textContent = '📷 Select Screenshots';
            uploadBtn.onclick = () => fileInput.click();
            uploadZone.appendChild(uploadBtn);

            // Info
            const info = document.createElement('div');
            info.style.cssText = 'margin-top: var(--space-lg); padding: var(--space-md); background: rgba(59, 130, 246, 0.15); border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--color-text-secondary);';
            info.innerHTML = '💡 <strong>Tip:</strong> Select multiple screenshots. See each image and quickly enter all results with keyboard shortcuts!';
            uploadZone.appendChild(info);

            // File handler
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleBulkUpload(e.target.files, extractedNumbers);
                }
            });

            fileInput.setAttribute('accept', 'image/*');
            fileInput.setAttribute('multiple', 'multiple');
        }

        handleBulkUpload(files, container) {
            console.log('[Bulk Entry] Processing', files.length, 'files');

            this.totalImages = files.length;
            this.currentImageIndex = 0;
            container.innerHTML = '';

            // Create main container
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                border: 2px solid var(--color-primary);
                border-radius: var(--radius-xl);
                padding: var(--space-lg);
                background: var(--color-bg-card);
                margin-top: var(--space-lg);
            `;

            // Header
            const header = document.createElement('div');
            header.style.cssText = 'text-align: center; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 2px solid var(--color-border);';
            header.innerHTML = `
                <div style="font-size: 40px;">🎯</div>
                <div style="font-weight: 700; font-size: var(--font-size-xl); color: var(--color-primary); margin-top: var(--space-sm);">
                    Bulk Entry Mode
                </div>
                <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--space-xs);">
                    ${files.length} screenshot${files.length > 1 ? 's' : ''} • Enter all results quickly
                </div>
            `;
            wrapper.appendChild(header);

            // Process first image
            this.showImageEntry(files, 0, wrapper);

            container.appendChild(wrapper);
        }

        showImageEntry(files, index, container) {
            const file = files[index];
            this.currentImageIndex = index;

            // Remove previous entry if exists
            const existing = container.querySelector('.image-entry-section');
            if (existing) existing.remove();

            // Create entry section
            const section = document.createElement('div');
            section.className = 'image-entry-section';
            section.style.cssText = 'margin-top: var(--space-lg);';

            // Progress indicator
            const progress = document.createElement('div');
            progress.style.cssText = 'text-align: center; margin-bottom: var(--space-md); padding: var(--space-sm); background: rgba(139, 92, 246, 0.1); border-radius: var(--radius-md);';
            progress.innerHTML = `
                <div style="font-weight: 600; color: var(--color-primary);">
                    Screenshot ${index + 1} of ${this.totalImages}
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: var(--space-xs);">
                    ${file.name}
                </div>
            `;
            section.appendChild(progress);

            // Image preview
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = 'text-align: center; margin-bottom: var(--space-lg);';

            const img = document.createElement('img');
            img.style.cssText = `
                max-width: 100%;
                max-height: 400px;
                object-fit: contain;
                border-radius: var(--radius-lg);
                border: 2px solid var(--color-border);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            `;

            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.readAsDataURL(file);

            imgContainer.appendChild(img);
            section.appendChild(imgContainer);

            // Quick entry form
            const form = document.createElement('div');
            form.style.cssText = 'background: rgba(59, 130, 246, 0.05); padding: var(--space-lg); border-radius: var(--radius-lg); border: 2px solid var(--color-border);';
            form.innerHTML = `
                <div style="font-weight: 700; font-size: var(--font-size-lg); margin-bottom: var(--space-md); color: var(--color-primary);">
                    ⚡ Quick Entry Form
                </div>
                
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-md); margin-bottom: var(--space-md);">
                    <div>
                        <label style="display: block; font-weight: 600; font-size: var(--font-size-sm); margin-bottom: var(--space-xs); color: var(--color-text);">
                            🔢 Period ID (Optional)
                        </label>
                        <input 
                            type="text" 
                            id="bulk-period-${index}" 
                            placeholder="e.g., 2025010812345678"
                            style="width: 100%; padding: var(--space-md); border: 2px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text); font-size: var(--font-size-base);"
                        >
                    </div>
                    <div>
                        <label style="display: block; font-weight: 700; font-size: var(--font-size-sm); margin-bottom: var(--space-xs); color: var(--color-primary);">
                            🎯 Sum (3-18) *
                        </label>
                        <input 
                            type="number" 
                            id="bulk-sum-${index}" 
                            min="3" 
                            max="18" 
                            placeholder="Sum"
                            style="width: 100%; padding: var(--space-md); border: 3px solid var(--color-primary); border-radius: var(--radius-md); background: var(--color-bg-tertiary); color: var(--color-text); font-size: var(--font-size-xl); font-weight: 700; text-align: center;"
                        >
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
                    <button 
                        id="add-entry-btn-${index}"
                        class="btn btn-primary" 
                        type="button"
                        style="padding: var(--space-lg); font-weight: 700; font-size: var(--font-size-base); background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: var(--radius-lg);"
                    >
                        ✅ Add Entry (Enter ↵)
                    </button>
                    <button 
                        id="next-image-btn-${index}"
                        class="btn btn-outline" 
                        type="button"
                        style="padding: var(--space-lg); font-weight: 700; font-size: var(--font-size-base); border: 2px solid var(--color-primary); border-radius: var(--radius-lg); background: transparent; color: var(--color-primary);"
                    >
                        ⏭️ Next Screenshot
                    </button>
                </div>

                <div id="entries-count-${index}" style="margin-top: var(--space-md); text-align: center; font-weight: 600; color: var(--color-success);"></div>
            `;
            section.appendChild(form);

            container.appendChild(section);

            // Setup event handlers
            setTimeout(() => {
                const sumInput = document.getElementById(`bulk-sum-${index}`);
                const periodInput = document.getElementById(`bulk-period-${index}`);
                const addBtn = document.getElementById(`add-entry-btn-${index}`);
                const nextBtn = document.getElementById(`next-image-btn-${index}`);
                const countDiv = document.getElementById(`entries-count-${index}`);

                let entriesAdded = 0;

                const addEntry = () => {
                    const sum = parseInt(sumInput.value);
                    if (!sum || sum < 3 || sum > 18) {
                        alert('Please enter a valid sum (3-18)');
                        sumInput.focus();
                        return;
                    }

                    const period = periodInput.value.trim();

                    // Add to app
                    if (window.app) {
                        if (period) {
                            const mainPeriodInput = document.getElementById('periodInput');
                            if (mainPeriodInput) {
                                mainPeriodInput.value = period;
                                mainPeriodInput.dispatchEvent(new Event('input'));
                            }
                        }

                        window.app.addNumber(sum);

                        entriesAdded++;
                        countDiv.textContent = `✅ ${entriesAdded} entr${entriesAdded === 1 ? 'y' : 'ies'} added from this screenshot`;

                        // Clear form for next entry
                        sumInput.value = '';

                        // Focus sum for next entry
                        sumInput.focus();

                        // Haptic feedback
                        if (window.hapticFeedback) {
                            window.hapticFeedback.success();
                        }
                    }
                };

                const nextImage = () => {
                    if (index + 1 < this.totalImages) {
                        this.showImageEntry(files, index + 1, container.parentElement);
                    } else {
                        // All done
                        const doneMsg = document.createElement('div');
                        doneMsg.style.cssText = 'text-align: center; padding: var(--space-xxl); background: linear-gradient(135deg, #10b981, #059669); border-radius: var(--radius-xl); color: white; margin-top: var(--space-lg);';
                        doneMsg.innerHTML = `
                            <div style="font-size: 64px; margin-bottom: var(--space-md);">🎉</div>
                            <div style="font-weight: 700; font-size: var(--font-size-xl);">All screenshots processed!</div>
                            <div style="margin-top: var(--space-sm); font-size: var(--font-size-base);">Check your history to see all the entries</div>
                        `;
                        container.parentElement.appendChild(doneMsg);
                        section.remove();
                    }
                };

                addBtn.onclick = addEntry;
                nextBtn.onclick = nextImage;

                // Enter key to add
                [sumInput, periodInput].forEach(input => {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addEntry();
                        }
                    });
                });

                // Auto-focus sum input
                sumInput.focus();
            }, 100);
        }
    }

    window.bulkEntrySystem = new BulkEntrySystem();
    console.log('[Bulk Entry] ✅ System ready!');
})();
