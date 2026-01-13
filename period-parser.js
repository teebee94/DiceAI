// =======================================
// Period Parser
// Handles period numbers and timeframes
// =======================================

class PeriodParser {
    constructor() {
        this.timeframes = {
            '1min': { minutes: 1, runsPerDay: 1440, name: '1 Minute' },
            '3min': { minutes: 3, runsPerDay: 480, name: '3 Minutes' },
            '5min': { minutes: 5, runsPerDay: 288, name: '5 Minutes' },
            '10min': { minutes: 10, runsPerDay: 144, name: '10 Minutes' }
        };
    }

    // Validate period number format
    isValidPeriod(periodString) {
        if (!periodString) return false;
        const cleaned = periodString.replace(/\s+/g, '');

        // Format: YYYYMMDDHHMMSSXXX (17-19 digits)
        if (cleaned.length < 17 || cleaned.length > 19) return false;
        if (!/^\d+$/.test(cleaned)) return false;

        try {
            const parsed = this.parsePeriod(periodString);

            // Validate ranges
            if (parsed.year < 2000 || parsed.year > 2100) return false;
            if (parsed.month < 1 || parsed.month > 12) return false;
            if (parsed.day < 1 || parsed.day > 31) return false;
            if (parsed.hour < 0 || parsed.hour > 23) return false;
            if (parsed.minute < 0 || parsed.minute > 59) return false;
            if (parsed.second < 0 || parsed.second > 59) return false;

            return true;
        } catch (e) {
            return false;
        }
    }

    // Parse period number into components
    parsePeriod(periodString) {
        const cleaned = periodString.replace(/\s+/g, '');

        return {
            year: parseInt(cleaned.substring(0, 4)),
            month: parseInt(cleaned.substring(4, 6)),
            day: parseInt(cleaned.substring(6, 8)),
            hour: parseInt(cleaned.substring(8, 10)),
            minute: parseInt(cleaned.substring(10, 12)),
            second: parseInt(cleaned.substring(12, 14)),
            run: cleaned.length > 14 ? parseInt(cleaned.substring(14)) : 0
        };
    }

    // Format period for display
    formatPeriodDisplay(periodString) {
        const parsed = this.parsePeriod(periodString);
        const date = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
        const time = `${String(parsed.hour).padStart(2, '0')}:${String(parsed.minute).padStart(2, '0')}:${String(parsed.second).padStart(2, '0')}`;
        return `${date} ${time} #${parsed.run}`;
    }

    // Get next period based on timeframe
    getNextPeriod(currentPeriod, timeframe) {
        const parsed = this.parsePeriod(currentPeriod);
        const info = this.timeframes[timeframe];

        if (!info) return currentPeriod;

        // Create date object
        const date = new Date(
            parsed.year,
            parsed.month - 1,
            parsed.day,
            parsed.hour,
            parsed.minute,
            parsed.second
        );

        // Add timeframe minutes
        date.setMinutes(date.getMinutes() + info.minutes);

        // Format back to period string
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');

        // Calculate new run number
        const newRun = parsed.run + 1;
        const runPadding = String(newRun).padStart(String(parsed.run).length || 3, '0');

        return `${year}${month}${day}${hour}${minute}${second}${runPadding}`;
    }

    // Get timeframe info
    getTimeframeInfo(timeframe) {
        return this.timeframes[timeframe] || this.timeframes['3min'];
    }

    // Calculate run number for current time
    calculateRunNumber(timeframe, date = new Date()) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const minutesSinceStart = Math.floor((date - startOfDay) / 60000);
        const info = this.timeframes[timeframe];

        return Math.floor(minutesSinceStart / info.minutes) + 1;
    }

    // Generate period for current time
    generateCurrentPeriod(timeframe) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');

        const runNumber = this.calculateRunNumber(timeframe, now);
        const run = String(runNumber).padStart(3, '0');

        return `${year}${month}${day}${hour}${minute}${second}${run}`;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeriodParser;
}
