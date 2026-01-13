// =======================================
// Firebase Sync Manager
// Handles data synchronization with Firestore
// =======================================

class FirebaseSync {
    constructor(app) {
        this.app = app;
        this.db = db; // From firebase-config.js
        this.auth = auth; // From firebase-config.js
        this.userId = null;
        this.syncEnabled = true;
        this.lastSyncTime = null;
        this.syncInProgress = false;
    }

    // Called when auth state changes
    onAuthChanged(user) {
        if (user) {
            this.userId = user.uid;
            this.syncFromCloud(); // Pull data from cloud
        } else {
            this.userId = null;
        }
    }

    // Sync data to cloud
    async syncToCloud() {
        if (!this.syncEnabled || !this.userId || this.syncInProgress) return;

        this.syncInProgress = true;
        this.updateSyncStatus('Syncing to cloud...');

        try {
            const data = this.prepareDataForSync();

            await this.db.collection('users').doc(this.userId).set({
                profile: {
                    lastSync: firebase.firestore.FieldValue.serverTimestamp(),
                    version: '2.0'
                },
                history: data.history,
                learning: data.learning,
                settings: data.settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            this.lastSyncTime = Date.now();
            this.updateSyncStatus('✅ Synced to cloud');
            console.log('✅ Data synced to cloud successfully');

        } catch (error) {
            console.error('❌ Sync to cloud failed:', error);
            this.updateSyncStatus('❌ Sync failed');
        } finally {
            this.syncInProgress = false;
            setTimeout(() => this.updateSyncStatus(''), 3000);
        }
    }

    // Sync data from cloud
    async syncFromCloud() {
        if (!this.syncEnabled || !this.userId || this.syncInProgress) return;

        this.syncInProgress = true;
        this.updateSyncStatus('Syncing from cloud...');

        try {
            const doc = await this.db.collection('users').doc(this.userId).get();

            if (doc.exists) {
                const cloudData = doc.data();
                this.mergeCloudData(cloudData);
                this.lastSyncTime = Date.now();
                this.updateSyncStatus('✅ Synced from cloud');
                console.log('✅ Data synced from cloud successfully');
            } else {
                // No cloud data yet, push local data
                await this.syncToCloud();
            }

        } catch (error) {
            console.error('❌ Sync from cloud failed:', error);
            this.updateSyncStatus('❌ Sync failed');
        } finally {
            this.syncInProgress = false;
            setTimeout(() => this.updateSyncStatus(''), 3000);
        }
    }

    // Prepare app data for cloud sync
    prepareDataForSync() {
        const timeframes = {};

        Object.keys(this.app.timeframeData).forEach(tf => {
            const tfData = this.app.timeframeData[tf];
            timeframes[tf] = {
                history: tfData.predictionEngine.history,
                metadata: tfData.metadata,
                learningData: tfData.learningEngine.exportLearningData(),
                lastPeriod: tfData.lastPeriod
            };
        });

        return {
            history: timeframes,
            learning: {
                currentTimeframe: this.app.currentTimeframe
            },
            settings: {
                theme: localStorage.getItem('diceai_theme') || 'default',
                competitiveMode: this.app.predictionEngine.competitiveMode,
                confidenceThreshold: this.app.predictionEngine.confidenceThreshold
            }
        };
    }

    // Merge cloud data with local data
    mergeCloudData(cloudData) {
        if (!cloudData) return;

        // Merge history for each timeframe
        if (cloudData.history) {
            Object.keys(cloudData.history).forEach(tf => {
                const tfData = cloudData.history[tf];
                if (tfData.history) {
                    this.app.timeframeData[tf].predictionEngine.loadHistory(tfData.history);
                }
                if (tfData.metadata) {
                    this.app.timeframeData[tf].metadata = tfData.metadata;
                    this.app.timeframeData[tf].predictionEngine.metadata = tfData.metadata;
                }
                if (tfData.learningData) {
                    this.app.timeframeData[tf].learningEngine.importLearningData(tfData.learningData);
                }
                if (tfData.lastPeriod) {
                    this.app.timeframeData[tf].lastPeriod = tfData.lastPeriod;
                }
            });
        }

        // Merge settings
        if (cloudData.settings) {
            if (cloudData.settings.theme) {
                this.app.themeManager.applyTheme(cloudData.settings.theme);
            }
            if (cloudData.settings.competitiveMode !== undefined) {
                this.app.predictionEngine.competitiveMode = cloudData.settings.competitiveMode;
            }
            if (cloudData.settings.confidenceThreshold !== undefined) {
                this.app.predictionEngine.confidenceThreshold = cloudData.settings.confidenceThreshold;
            }
        }

        // Update displays
        this.app.updateAllDisplays();
        this.app.updateCurrentGameInfo();

        // Save to localStorage as backup
        this.app.saveData();
    }

    // Update sync status UI
    updateSyncStatus(message) {
        const statusEl = document.getElementById('syncStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // Toggle auto-sync
    toggleSync(enabled) {
        this.syncEnabled = enabled;
        localStorage.setItem('diceai_sync_enabled', enabled);
        console.log(`Auto-sync ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Manual sync trigger
    async manualSync() {
        if (!this.userId) {
            alert('Please sign in to sync data');
            return;
        }

        await this.syncToCloud();
        await this.syncFromCloud();
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseSync;
}
