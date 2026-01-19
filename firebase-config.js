// =======================================
// Firebase Configuration
// Cloud database and authentication
// =======================================

// Firebase configuration object
// IMPORTANT: Replace these values with your Firebase project credentials
// Get from: https://console.firebase.google.com/ → Project Settings → General
const firebaseConfig = {
    // TODO: Get these from Firebase Console
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (will be called when Firebase SDK loads)
let firebaseApp = null;
let auth = null;
let db = null;

function initializeFirebase() {
    // Check if keys are configured
    if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
        console.log('ℹ️ Firebase not configured yet.');
        return false;
    }

    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            firebaseApp = firebase.app();
        }

        auth = firebase.auth();
        db = firebase.firestore();

        // Enable offline persistence
        db.enablePersistence()
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('Persistence failed: Multiple tabs open');
                } else if (err.code === 'unimplemented') {
                    console.warn('Persistence not supported');
                }
            });

        console.log('✅ Firebase initialized successfully');

        // Set up auth state listener
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('✅ User signed in:', user.email || 'Anonymous');
                // Trigger sync when user signs in
                if (window.app && window.app.firebaseSync) {
                    window.app.firebaseSync.onAuthChanged(user);
                }
                const authBtn = document.getElementById('authButton');
                if (authBtn) authBtn.textContent = '👤 ' + (user.email ? user.email.split('@')[0] : 'Guest');
            } else {
                console.log('❌ User signed out');
                const authBtn = document.getElementById('authButton');
                if (authBtn) authBtn.textContent = '☁️ Cloud Sync';
            }
        });

        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}

// Authentication functions
const FirebaseAuth = {
    // Sign in with Google
    signInWithGoogle: async () => {
        console.warn('🔒 Firebase is disabled. Enable it first to use cloud sync.');
        return { success: false, error: 'Firebase not configured. App works offline only.' };
    },

    // Sign in with email/password
    signInWithEmail: async (email, password) => {
        console.warn('🔒 Firebase is disabled. Enable it first to use cloud sync.');
        return { success: false, error: 'Firebase not configured. App works offline only.' };
    },

    // Sign up with email/password
    signUpWithEmail: async (email, password) => {
        console.warn('🔒 Firebase is disabled. Enable it first to use cloud sync.');
        return { success: false, error: 'Firebase not configured. App works offline only.' };
    },

    // Sign in anonymously (for guests)
    signInAnonymously: async () => {
        console.warn('🔒 Firebase is disabled. Enable it first to use cloud sync.');
        return { success: false, error: 'Firebase not configured. App works offline only.' };
    },

    // Sign out
    signOut: async () => {
        console.warn('🔒 Firebase is disabled.');
        return { success: true };
    },

    // Get current user
    getCurrentUser: () => {
        return null;
    },

    // Check if user is signed in
    isSignedIn: () => {
        return false;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, initializeFirebase, FirebaseAuth };
}
