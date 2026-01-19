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
    // Firebase disabled - no credentials configured
    // Firebase disabled - no credentials configured
    console.warn('⚠️ Sync Disabled: Add your Firebase keys in firebase-config.js to enable cloud sync.');
    console.warn('Get keys from: https://console.firebase.google.com/');

    /* UNCOMMENT THIS BLOCK AFTER ADDING YOUR FIREBASE CREDENTIALS
    
    try {
        // Initialize Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        // Enable offline persistence
        db.enablePersistence()
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
                } else if (err.code === 'unimplemented') {
                    console.warn('The current browser doesn\'t support persistence.');
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
            } else {
                console.log('❌ User signed out');
            }
        });

        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
    */

    return false;
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
