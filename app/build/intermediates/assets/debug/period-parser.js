// =======================================
// Period Number Parser & Timeframe Manager
// Handles game period calculations
// =======================================

class PeriodParser {
    constructor() {
        this.timeframes = {
            '1min': {
                name: '1 Minute',
                interval: 60,
                runsPerDay: 1440,
                secondsInterval: 60
            },
            '3min': {
                name: '3 Minutes',
                interval: 180,
                runsPerDay: 480,
                secondsInterval: 180
            },
            '5min': {
                name: '5 Minutes',
                interval: 300,
                runsPerDay: 288,
                secondsInterval: 300
            },
            '10min': {
                name: '10 Minutes',
                interval: 600,
                runsPerDay: 144,
                secondsInterval: 600
            }
        };
    }

    /**
     * Parse period number string
     * Format: YYYYMMDDHHMMSSXXX
     * Example: 2025122910102028 9 → Year:2025, Month:12, Day:29, Hour:10, Min:10, Sec:20, Run:289
     */
    parsePeriod(periodString) {
        // Remove any spaces and get the numeric part
        const cleaned = periodString.replace(/\s+/g, '');

        if (cleaned.length < 14) {
            throw new Error('Invalid period format. Expected: YYYYMMDDHHMMSSXXX');
        }

        return {
            year: parseInt(cleaned.substring(0, 4)),
            month: parseInt(cleaned.substring(4, 6)),
            day: parseInt(cleaned.substring(6, 8)),
            hour: parseInt(cleaned.substring(8, 10)),
            minute: parseInt(cleaned.substring(10, 12)),
            second: parseInt(cleaned.substring(12, 14)),
            run: cleaned.length > 14 ? parseInt(cleaned.substring(14)) : 0,
            raw: cleaned
        };
    }

    /**
     * Generate period number for a given date/time and run number
     */
    generatePeriod(date, runNumber) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        const run = String(runNumber).padStart(3, '0');

        return `${year}${month}${day}${hour}${minute}${second}${run}`;
    }

    /**
     * Calculate next period based on current period and timeframe
     */
    getNextPeriod(currentPeriod, timeframe = '3min') {
        const parsed = this.parsePeriod(currentPeriod);
        const tf = this.timeframes[timeframe];

        if (!tf) {
            throw new Error(`Invalid timeframe: ${timeframe}`);
        }

        // Create date from parsed period
        const date = new Date(
            parsed.year,
            parsed.month - 1,
            parsed.day,
            parsed.hour,
            parsed.minute,
            parsed.second
        );

        // Add timeframe interval
        date.setSeconds(date.getSeconds() + tf.secondsInterval);

        // Calculate next run number
        let nextRun = parsed.run + 1;

        // Check if we've crossed midnight (reset to run 1)
        const currentDay = new Date(parsed.year, parsed.month - 1, parsed.day).getDate();
        const nextDay = date.getDate();

        if (currentDay !== nextDay) {
            nextRun = 1; // Reset to run 1 at midnight
        }

        return this.generatePeriod(date, nextRun);
    }

    /**
     * Get timeframe info
     */
    getTimeframeInfo(timeframe) {
        return this.timeframes[timeframe] || null;
    }

    /**
     * Get all available timeframes
     */
    getAllTimeframes() {
        return Object.keys(this.timeframes).map(key => ({
            id: key,
            ...this.timeframes[key]
        }));
    }

    /**
     * Calculate which run number this should be based on time
     */
    calculateRunNumber(date, timeframe = '3min') {
        const tf = this.timeframes[timeframe];
        if (!tf) return 0;

        // Start of day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        // Seconds since midnight
        const secondsSinceMidnight = (date - startOfDay) / 1000;

        // Run number = (seconds since midnight / interval) + 1
        return Math.floor(secondsSinceMidnight / tf.secondsInterval) + 1;
    }

    /**
     * Format period for display
     */
    formatPeriodDisplay(periodString) {
        try {
            const parsed = this.parsePeriod(periodString);
            const dateStr = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
            const timeStr = `${String(parsed.hour).padStart(2, '0')}:${String(parsed.minute).padStart(2, '0')}:${String(parsed.second).padStart(2, '0')}`;
            return `${dateStr} ${timeStr} #${parsed.run}`;
        } catch (e) {
            return periodString;
        }
    }

    /**
     * Validate period format
     */
    isValidPeriod(periodString) {
        try {
            const parsed = this.parsePeriod(periodString);
            return parsed.year >= 2020 &&
                parsed.month >= 1 && parsed.month <= 12 &&
                parsed.day >= 1 && parsed.day <= 31 &&
                parsed.hour >= 0 && parsed.hour <= 23 &&
                parsed.minute >= 0 && parsed.minute <= 59 &&
                parsed.second >= 0 && parsed.second <= 59;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get time until next game
     */
    getTimeUntilNext(currentPeriod, timeframe = '3min') {
        const parsed = this.parsePeriod(currentPeriod);
        const tf = this.timeframes[timeframe];

        const periodDate = new Date(
            parsed.year,
            parsed.month - 1,
            parsed.day,
            parsed.hour,
            parsed.minute,
            parsed.second
        );

        const nextGameTime = new Date(periodDate.getTime() + (tf.secondsInterval * 1000));
        const now = new Date();
        const diff = nextGameTime - now;

        if (diff <= 0) return { minutes: 0, seconds: 0, total: 0 };

        return {
            minutes: Math.floor(diff / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
            total: diff
        };
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeriodParser;
}
