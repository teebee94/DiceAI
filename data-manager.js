// =======================================
// Data Manager
// Clean up, organize, and fix data issues
// =======================================

class DataManager {
    constructor(app) {
        this.app = app;
    }

    // Find duplicate entries
    findDuplicates() {
        const duplicates = [];
        const seen = new Map();

        this.app.currentData.metadata.forEach((entry, index) => {
            const key = `${entry.period || 'noperiod'}-${entry.number}`;

            if (seen.has(key)) {
                duplicates.push({
                    index: index,
                    original: seen.get(key),
                    duplicate: entry,
                    key: key
                });
            } else {
                seen.set(key, { index, entry });
            }
        });

        return duplicates;
    }

    // Remove duplicates (keeps first occurrence)
    removeDuplicates() {
        const duplicates = this.findDuplicates();

        if (duplicates.length === 0) {
            return { removed: 0, message: 'No duplicates found!' };
        }

        // Sort by index descending to remove from end first
        const indicesToRemove = duplicates.map(d => d.index).sort((a, b) => b - a);

        indicesToRemove.forEach(index => {
            this.app.currentData.metadata.splice(index, 1);
            this.app.predictionEngine.history.splice(index, 1);
        });

        this.app.saveData();
        this.app.updateAllDisplays();

        return {
            removed: duplicates.length,
            message: `✅ Removed ${duplicates.length} duplicate entries!`
        };
    }

    // Extract series number from period
    extractSeriesFromPeriod(period) {
        if (!period || period.length < 17) return null;

        // Period format: YYYYMMDDHHMMSSIII (17-18 digits)
        // Series is the last 2-3 digits
        const seriesStr = period.slice(-3); // Last 3 digits
        return parseInt(seriesStr);
    }

    // Find series numbering issues
    findSeriesIssues() {
        const issues = [];
        const entries = this.app.currentData.metadata
            .map((entry, index) => ({
                index,
                entry,
                series: this.extractSeriesFromPeriod(entry.period),
                period: entry.period
            }))
            .filter(e => e.series !== null);

        if (entries.length === 0) {
            return { issues: [], message: 'No period numbers with series found' };
        }

        // Check for gaps, duplicates, or out-of-order
        for (let i = 1; i < entries.length; i++) {
            const prev = entries[i - 1];
            const curr = entries[i];

            // Check for duplicate series
            if (curr.series === prev.series) {
                issues.push({
                    type: 'duplicate',
                    index: curr.index,
                    series: curr.series,
                    period: curr.period,
                    message: `Series ${curr.series} appears multiple times`
                });
            }
            // Check for backwards jump
            else if (curr.series < prev.series) {
                issues.push({
                    type: 'backwards',
                    index: curr.index,
                    series: curr.series,
                    prevSeries: prev.series,
                    period: curr.period,
                    message: `Series jumps backwards: ${prev.series} → ${curr.series}`
                });
            }
            // Check for large gap (> 50)
            else if (curr.series - prev.series > 50) {
                issues.push({
                    type: 'gap',
                    index: curr.index,
                    series: curr.series,
                    prevSeries: prev.series,
                    gap: curr.series - prev.series,
                    period: curr.period,
                    message: `Large gap: ${prev.series} → ${curr.series} (${curr.series - prev.series})`
                });
            }
        }

        return {
            issues,
            entries,
            message: issues.length > 0 ?
                `Found ${issues.length} series issues` :
                'All series numbers look good!'
        };
    }

    // Fix series numbering automatically
    fixSeriesNumbering() {
        const { issues, entries } = this.findSeriesIssues();

        if (issues.length === 0) {
            return { fixed: 0, message: 'No issues to fix!' };
        }

        let fixed = 0;
        let expectedSeries = null;

        entries.forEach((item, idx) => {
            if (idx === 0) {
                // First entry sets the baseline
                expectedSeries = item.series;
            } else {
                // Increment expected series
                expectedSeries++;

                // If current doesn't match expected, fix it
                if (item.series !== expectedSeries) {
                    console.log(`Fixing series: ${item.series} → ${expectedSeries}`);

                    // Update period number (last 3 digits)
                    const oldPeriod = item.period;
                    const newPeriod = oldPeriod.slice(0, -3) + expectedSeries.toString().padStart(3, '0');

                    this.app.currentData.metadata[item.index].period = newPeriod;
                    fixed++;
                }
            }
        });

        if (fixed > 0) {
            this.app.saveData();
            this.app.updateAllDisplays();
        }

        return {
            fixed,
            message: fixed > 0 ?
                `✅ Fixed ${fixed} series numbers!` :
                'No fixes needed!'
        };
    }

    // Sort entries by period/timestamp
    sortByDate() {
        const sorted = [...this.app.currentData.metadata].sort((a, b) => {
            // Sort by period if available
            if (a.period && b.period) {
                return a.period.localeCompare(b.period);
            }
            // Otherwise by timestamp
            return (a.timestamp || 0) - (b.timestamp || 0);
        });

        // Check if order changed
        const orderChanged = !sorted.every((entry, i) =>
            entry === this.app.currentData.metadata[i]
        );

        if (orderChanged) {
            this.app.currentData.metadata = sorted;
            this.app.predictionEngine.loadHistory(sorted.map(e => ({
                number: e.number,
                timestamp: e.timestamp,
                isBig: e.isBig,
                isEven: e.isEven
            })));

            this.app.saveData();
            this.app.updateAllDisplays();

            return { sorted: true, message: '✅ Sorted entries by date!' };
        }

        return { sorted: false, message: 'Already in correct order!' };
    }

    // Validate all entries
    validateData() {
        const invalid = [];

        this.app.currentData.metadata.forEach((entry, index) => {
            const issues = [];

            // Check sum range
            if (entry.number < 3 || entry.number > 18) {
                issues.push('Invalid sum (must be 3-18)');
            }

            // Check period format
            if (entry.period && (entry.period.length < 17 || entry.period.length > 18)) {
                issues.push('Invalid period format');
            }

            // Check dice values
            if (entry.dice) {
                if (entry.dice.length !== 3) {
                    issues.push('Dice must have 3 values');
                }
                if (entry.dice.some(d => d < 1 || d > 6)) {
                    issues.push('Dice values must be 1-6');
                }
                // Check if sum matches dice
                const diceSum = entry.dice.reduce((a, b) => a + b, 0);
                if (diceSum !== entry.number) {
                    issues.push(`Dice sum (${diceSum}) doesn't match number (${entry.number})`);
                }
            }

            if (issues.length > 0) {
                invalid.push({ index, entry, issues });
            }
        });

        return {
            invalid,
            message: invalid.length > 0 ?
                `Found ${invalid.length} invalid entries` :
                'All data is valid!'
        };
    }

    // Remove invalid entries
    removeInvalid() {
        const { invalid } = this.validateData();

        if (invalid.length === 0) {
            return { removed: 0, message: 'No invalid entries!' };
        }

        // Remove from end to start
        const indicesToRemove = invalid.map(i => i.index).sort((a, b) => b - a);

        indicesToRemove.forEach(index => {
            this.app.currentData.metadata.splice(index, 1);
            this.app.predictionEngine.history.splice(index, 1);
        });

        this.app.saveData();
        this.app.updateAllDisplays();

        return {
            removed: invalid.length,
            message: `✅ Removed ${invalid.length} invalid entries!`
        };
    }

    // Get data statistics
    getStats() {
        const total = this.app.currentData.metadata.length;
        const duplicates = this.findDuplicates().length;
        const { issues } = this.findSeriesIssues();
        const { invalid } = this.validateData();

        return {
            total,
            duplicates,
            seriesIssues: issues.length,
            invalidEntries: invalid.length,
            isClean: duplicates === 0 && issues.length === 0 && invalid.length === 0
        };
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
