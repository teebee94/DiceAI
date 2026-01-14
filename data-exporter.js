// =======================================
// Data Exporter
// Export/Import data
// =======================================

class DataExporter {
    constructor(app) {
        this.app = app;
    }

    // Export all data as JSON
    exportToJSON() {
        const data = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            history: this.app.currentData.metadata,
            learningData: this.app.currentData.learningEngine.exportLearningData(),
            settings: {
                theme: localStorage.getItem('diceai_theme'),
                competitiveMode: this.app.predictionEngine.competitiveMode,
                confidenceThreshold: this.app.predictionEngine.confidenceThreshold
            },
            analytics: this.app.analyticsEngine?.getFullReport(),
            predictions: this.app.predictionTracker?.predictions || []
        };

        return JSON.stringify(data, null, 2);
    }

    // Download JSON file
    downloadJSON() {
        const json = this.exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `diceai-backup-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);

        return { success: true, message: 'Data exported successfully!' };
    }

    // Export as CSV
    exportToCSV() {
        const metadata = this.app.currentData.metadata;

        if (!metadata || metadata.length === 0) {
            return 'No data to export';
        }

        // CSV header
        let csv = 'Period,Sum,Dice1,Dice2,Dice3,IsBig,IsEven,Timestamp,Predicted,WasCorrect\n';

        // CSV rows
        metadata.forEach(entry => {
            const dice = entry.dice || [0, 0, 0];
            csv += [
                entry.period || '',
                entry.number,
                dice[0],
                dice[1],
                dice[2],
                entry.isBig ? 'Big' : 'Small',
                entry.isEven ? 'Even' : 'Odd',
                new Date(entry.timestamp).toISOString(),
                entry.predictedNumber || '',
                entry.predictedCorrectly === true ? 'Yes' : entry.predictedCorrectly === false ? 'No' : ''
            ].join(',') + '\n';
        });

        return csv;
    }

    // Download CSV file
    downloadCSV() {
        const csv = this.exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `diceai-data-${Date.now()}.csv`;
        a.click();

        URL.revokeObjectURL(url);

        return { success: true, message: 'CSV exported successfully!' };
    }

    // Import from JSON
    async importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Validate version
            if (!data.version) {
                throw new Error('Invalid backup file');
            }

            // Import history
            if (data.history && Array.isArray(data.history)) {
                this.app.currentData.metadata = data.history;
                this.app.predictionEngine.loadHistory(
                    data.history.map(e => ({
                        number: e.number,
                        timestamp: e.timestamp,
                        isBig: e.isBig,
                        isEven: e.isEven
                    }))
                );
            }

            // Import learning data
            if (data.learningData) {
                this.app.currentData.learningEngine.importLearningData(data.learningData);
            }

            // Import settings
            if (data.settings) {
                if (data.settings.theme) {
                    this.app.themeManager?.applyTheme(data.settings.theme);
                }
                if (data.settings.competitiveMode !== undefined) {
                    this.app.predictionEngine.competitiveMode = data.settings.competitiveMode;
                }
            }

            // Import predictions
            if (data.predictions && this.app.predictionTracker) {
                this.app.predictionTracker.predictions = data.predictions;
                this.app.predictionTracker.saveToStorage();
            }

            // Save everything
            this.app.saveData();
            this.app.updateAllDisplays();

            return {
                success: true,
                message: `Imported ${data.history?.length || 0} entries successfully!`
            };

        } catch (error) {
            return {
                success: false,
                message: `Import failed: ${error.message}`
            };
        }
    }

    // Import from file
    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const result = await this.importFromJSON(e.target.result);
                resolve(result);
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    // Create backup reminder
    shouldBackup() {
        const lastBackup = localStorage.getItem('lastBackupDate');
        if (!lastBackup) return true;

        const daysSinceBackup = (Date.now() - parseInt(lastBackup)) / (1000 * 60 * 60 * 24);
        return daysSinceBackup >= 7; // Backup every week
    }

    // Mark backup done
    markBackupDone() {
        localStorage.setItem('lastBackupDate', Date.now().toString());
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataExporter;
}
