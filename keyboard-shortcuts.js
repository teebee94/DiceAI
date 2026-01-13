// =======================================
// Keyboard Shortcuts Enhancement
// Quick entry and actions via keyboard
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in input field or with modifier keys
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        const key = e.key.toLowerCase();

        // Number entry (3-9) - single digits
        if (key >= '3' && key <= '9' && typeof app !== 'undefined') {
            const num = parseInt(key);
            app.addNumber(num);
            e.preventDefault();
            console.log(`Quick entry: ${num}`);
        }

        // Actions
        if (typeof app !== 'undefined') {
            if (key === ' ') {
                // Spacebar = Generate Prediction
                app.generatePrediction();
                e.preventDefault();
                console.log('Generated prediction via keyboard');
            } else if (key === 'y') {
                // Y = Mark as Correct
                app.submitFeedback(true);
                e.preventDefault();
                console.log('Marked as correct via keyboard');
            } else if (key === 'n') {
                // N = Mark as Wrong
                app.submitFeedback(false);
                e.preventDefault();
                console.log('Marked as wrong via keyboard');
            } else if (key === 'e' && !e.shiftKey) {
                // E = Export (without shift to avoid conflict)
                app.exportData();
                e.preventDefault();
                console.log('Exported data via keyboard');
            } else if (key === 'c' && e.shiftKey) {
                // Shift+C = Toggle Competitive Mode
                const toggle = document.getElementById('competitiveModeToggle');
                if (toggle) {
                    toggle.checked = !toggle.checked;
                    toggle.dispatchEvent(new Event('change'));
                    e.preventDefault();
                    console.log('Toggled competitive mode via keyboard');
                }
            }
        }
    });

    // Show keyboard hints on page load
    console.log('🎹 Keyboard Shortcuts Enabled!');
    console.log('  3-9: Quick number entry');
    console.log('  SPACE: Generate prediction');
    console.log('  Y: Mark correct');
    console.log('  N: Mark wrong');
    console.log('  E: Export data');
    console.log('  Shift+C: Toggle competitive mode');
});
