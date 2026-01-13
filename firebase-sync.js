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
        this.realtimeListener = null; // NEW: Real-time listener
    }

    // Called when auth state changes
    onAuthChanged(user) {
        if (user) {
            this.userId = user.uid;
            this.syncFromCloud(); // Pull data from cloud
            this.startRealtimeSync(); // NEW: Start real-time listener
        } else {
            this.userId = null;
            this.stopRealtimeSync(); // NEW: Stop listener when signed out
        }
    }

    // NEW: Start real-time synchronization
    startRealtimeSync() {
        if (!this.userId || this.realtimeListener) return;

        console.log('🔴 Starting real-time sync...');
        this.updateSyncStatus('🔴 Live sync active');

        // Listen to changes in Firestore
        this.realtimeListener = this.db.collection('users')
            .doc(this.userId)
            .onSnapshot((doc) => {
                if (doc.exists && !this.syncInProgress) {
                    const cloudData = doc.data();
                    const cloudTimestamp = cloudData.updatedAt?.toMillis() || 0;
                    const localTimestamp = this.lastSyncTime || 0;

                    // Only update if cloud data is newer
                    if (cloudTimestamp > localTimestamp) {
                        console.log('📥 Receiving real-time update from cloud...');
                        this.updateSyncStatus('📥 Updating from another device...');
                        this.mergeCloudData(cloudData);
                        setTimeout(() => this.updateSyncStatus('🔴 Live'), 2000);
                    }
                }
            }, (error) => {
                console.error('❌ Real-time sync error:', error);
                this.updateSyncStatus('❌ Sync error');
            });
    }

    // NEW: Stop real-time synchronization
    stopRealtimeSync() {
        if (this.realtimeListener) {
            this.realtimeListener();
            this.realtimeListener = null;
            console.log('⚫ Stopped real-time sync');
            this.updateSyncStatus('');
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
    mergeCloudData(cloudData, skipSave = false) {
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

        // Save to localStorage as backup (but don't trigger cloud sync)
        if (!skipSave) {
            // Temporarily disable sync to prevent loop
            const wasSyncEnabled = this.syncEnabled;
            this.syncEnabled = false;
            localStorage.setItem('dicePredictionData', JSON.stringify(this.app.prepareDataForStorage()));
            this.syncEnabled = wasSyncEnabled;
        }
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
