// =======================================
// AI Chat Assistant
// Natural language interface for data management
// =======================================

class AIChatAssistant {
    constructor(app, dataManager) {
        this.app = app;
        this.dataManager = dataManager;
        this.chatHistory = [];
    }

    // Process user command
    async processCommand(userInput) {
        const input = userInput.toLowerCase().trim();
        this.chatHistory.push({ role: 'user', message: userInput });

        let response;

        // Match command patterns
        if (this.matchPattern(input, ['fix', 'series', 'number'])) {
            response = await this.handleFixSeries();
        }
        else if (this.matchPattern(input, ['remove', 'duplicate']) || this.matchPattern(input, ['delete', 'duplicate'])) {
            response = await this.handleRemoveDuplicates();
        }
        else if (this.matchPattern(input, ['find', 'duplicate'])) {
            response = await this.handleFindDuplicates();
        }
        else if (this.matchPattern(input, ['sort']) || this.matchPattern(input, ['order'])) {
            response = await this.handleSort();
        }
        else if (this.matchPattern(input, ['validate']) || this.matchPattern(input, ['check', 'data'])) {
            response = await this.handleValidate();
        }
        else if (this.matchPattern(input, ['clean']) || this.matchPattern(input, ['cleanup'])) {
            response = await this.handleCleanup();
        }
        else if (this.matchPattern(input, ['stats']) || this.matchPattern(input, ['status'])) {
            response = await this.handleStats();
        }
        else if (this.matchPattern(input, ['show', 'series']) || this.matchPattern(input, ['series', 'issue'])) {
            response = await this.handleShowSeriesIssues();
        }
        else if (this.matchPattern(input, ['help'])) {
            response = this.getHelpMessage();
        }
        else {
            response = this.getUnknownCommandResponse(input);
        }

        this.chatHistory.push({ role: 'assistant', message: response });
        return response;
    }

    // Pattern matching helper
    matchPattern(input, keywords) {
        return keywords.every(keyword => input.includes(keyword));
    }

    // Handle fix series command
    async handleFixSeries() {
        const { issues } = this.dataManager.findSeriesIssues();

        if (issues.length === 0) {
            return "✅ Your series numbers are already perfect! No issues found.";
        }

        const issuesSummary = issues.slice(0, 3).map(issue =>
            `• ${issue.message}`
        ).join('\n');

        const result = this.dataManager.fixSeriesNumbering();

        return `🔧 **Found ${issues.length} series issues:**\n${issuesSummary}${issues.length > 3 ? `\n...and ${issues.length - 3} more` : ''}\n\n${result.message}`;
    }

    // Handle find duplicates
    async handleFindDuplicates() {
        const duplicates = this.dataManager.findDuplicates();

        if (duplicates.length === 0) {
            return "✅ No duplicate entries found! Your data is clean.";
        }

        const summary = duplicates.slice(0, 5).map(dup =>
            `• Period ${dup.duplicate.period?.slice(-6) || 'N/A'} - Sum ${dup.duplicate.number}`
        ).join('\n');

        return `🔍 **Found ${duplicates.length} duplicate entries:**\n${summary}${duplicates.length > 5 ? `\n...and ${duplicates.length - 5} more` : ''}\n\nType "remove duplicates" to clean them up!`;
    }

    // Handle remove duplicates
    async handleRemoveDuplicates() {
        const result = this.dataManager.removeDuplicates();
        return result.message;
    }

    // Handle sort command
    async handleSort() {
        const result = this.dataManager.sortByDate();
        return result.message;
    }

    // Handle validate command
    async handleValidate() {
        const { invalid } = this.dataManager.validateData();

        if (invalid.length === 0) {
            return "✅ All data is valid! No errors found.";
        }

        const summary = invalid.slice(0, 3).map(item =>
            `• Entry #${item.index + 1}: ${item.issues.join(', ')}`
        ).join('\n');

        return `⚠️ **Found ${invalid.length} invalid entries:**\n${summary}${invalid.length > 3 ? `\n...and ${invalid.length - 3} more` : ''}\n\nType "cleanup" to remove them!`;
    }

    // Handle cleanup command
    async handleCleanup() {
        const stats = this.dataManager.getStats();

        if (stats.isClean) {
            return "✅ Your data is already clean! Nothing to do.";
        }

        let results = [];

        if (stats.duplicates > 0) {
            const dupResult = this.dataManager.removeDuplicates();
            results.push(dupResult.message);
        }

        if (stats.seriesIssues > 0) {
            const seriesResult = this.dataManager.fixSeriesNumbering();
            results.push(seriesResult.message);
        }

        if (stats.invalidEntries > 0) {
            const invalidResult = this.dataManager.removeInvalid();
            results.push(invalidResult.message);
        }

        const sortResult = this.dataManager.sortByDate();
        if (sortResult.sorted) {
            results.push(sortResult.message);
        }

        return `🧹 **Cleanup Complete!**\n\n${results.join('\n')}`;
    }

    // Handle stats command
    async handleStats() {
        const stats = this.dataManager.getStats();

        return `📊 **Data Statistics:**

Total Entries: ${stats.total}
Duplicates: ${stats.duplicates}
Series Issues: ${stats.seriesIssues}
Invalid Entries: ${stats.invalidEntries}

Status: ${stats.isClean ? '✅ Clean' : '⚠️ Needs Attention'}`;
    }

    // Handle show series issues
    async handleShowSeriesIssues() {
        const { issues } = this.dataManager.findSeriesIssues();

        if (issues.length === 0) {
            return "✅ No series issues! All numbers are sequential.";
        }

        const details = issues.map(issue =>
            `• ${issue.message} (Entry #${issue.index + 1})`
        ).join('\n');

        return `🔢 **Series Issues Found:**\n\n${details}\n\nType "fix series numbers" to auto-fix!`;
    }

    // Get help message
    getHelpMessage() {
        return `🤖 **AI Assistant Commands:**

**Data Cleanup:**
• "fix series numbers" - Fix 328, 350, 328 → 328, 329, 330
• "remove duplicates" - Delete duplicate entries
• "find duplicates" - Show duplicates
• "cleanup" - Fix everything at once

**Data Management:**
• "sort" - Sort by date/period
• "validate" - Check for errors
• "stats" - Show data statistics

**Analysis:**
• "show series issues" - List series problems

Type any command to get started!`;
    }

    // Unknown command response
    getUnknownCommandResponse(input) {
        // Try to be helpful based on keywords
        if (input.includes('series') || input.includes('328') || input.includes('350')) {
            return "🤔 It sounds like you want to fix series numbers! Try: \"fix series numbers\"";
        }
        if (input.includes('duplicate')) {
            return "🤔 Want to handle duplicates? Try: \"find duplicates\" or \"remove duplicates\"";
        }

        return `🤔 I didn't understand "${input}". Type "help" to see available commands!`;
    }

    // Get conversation history
    getHistory() {
        return this.chatHistory;
    }

    // Clear history
    clearHistory() {
        this.chatHistory = [];
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIChatAssistant;
}
