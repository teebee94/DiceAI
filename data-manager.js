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
            // Check for backwards jump (ignoring likely day reset)
            else if (curr.series < prev.series) {
                // If previous > 400 and current < 50, assume it's a new day (VALID)
                if (prev.series > 400 && curr.series < 50) {
                    continue; // Skip this, it's valid limit loop
                }

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
                // Ignore if it looks like a day reset or cross-day gap
                if (prev.series > 400 && curr.series < 50) continue;

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

        // This method assumes you want to force continuity. 
        // For day rollovers, we should only fix if it's NOT a rollover.
        // Implementation simplified: Only fixing explicitly flagged issues.
        // But the previous implementation re-numbered EVERYTHING. That's dangerous.
        // Let's change it to ONLY fix duplicate/weird issues if requested, 
        // OR renumber sequentially from start but respecting 480 limit?

        // Better approach: Tell user to delete invalid data instead of blindly fixing.
        // But if we must fix:
        if (issues.length === 0) {
            return { fixed: 0, message: 'No issues to fix!' };
        }

        // AUTO-RENAMING IS RISKY with day rollovers.
        // Let's just patch the specific logic for now to respect day boundary.
        let fixed = 0;
        let expectedSeries = null;

        entries.forEach((item, idx) => {
            if (idx === 0) {
                expectedSeries = item.series;
            } else {
                // Expected logic: +1, unless > 480 then 1
                expectedSeries++;
                if (expectedSeries > 480) expectedSeries = 1;

                // Check actual vs expected (with tolerance for day reset)
                // If item.series is 1 and previous was 480, that's fine.

                // If we match issues:
                // Only fix if it's marked as an issue? 
                // The previous logic was "renumber everything".
                // Let's just stick to the original logic but adding the module 480 check?
                // The user said "series is 24 hours".

                // If variance is small, fix it. If large, maybe it's a different day missing data.
                // Reverting to safe fix: only sequential +1
            }
        });

        return { fixed: 0, message: "Use 'delete' command to remove specific bad rows. Auto-fix is disabled to prevent data corruption on day rollovers." };
    }

    // Delete entry by series number
    deleteBySeries(seriesNum) {
        let deleted = 0;
        // Search backwards to delete latest first if duplicates
        for (let i = this.app.currentData.metadata.length - 1; i >= 0; i--) {
            const entry = this.app.currentData.metadata[i];
            const series = this.extractSeriesFromPeriod(entry.period);

            if (series === seriesNum || entry.period.endsWith(seriesNum.toString())) {
                this.app.currentData.metadata.splice(i, 1);
                this.app.predictionEngine.history.splice(i, 1);
                deleted++;
            }
        }

        if (deleted > 0) {
            this.app.saveData();
            this.app.updateAllDisplays();
            return { success: true, message: `✅ Deleted ${deleted} element(s) with series #${seriesNum}.` };
        }
        return { success: false, message: `❌ Could not find series #${seriesNum}.` };
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
