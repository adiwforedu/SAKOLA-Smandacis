// firebase-config.js
// PASTE FIREBASE CONFIG ANDA DI SINI
const firebaseConfig = {
    apiKey: "AIzaSyBQWdOQHr2PyLHvXRIMQQkdtucG9a3Sxxo",
    authDomain: "aplikasi-sakola.firebaseapp.com",
    projectId: "aplikasi-sakola",
    storageBucket: "aplikasi-sakola.firebasestorage.app",
    messagingSenderId: "93988025119",
    appId: "1:93988025119:web:24b91826905e732e31b62a"
};

// Initialize Firebase
let db = null;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log("Firebase Firestore initialized.");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Global Firebase Config object to replace gasConfig
window.gasConfig = {
    isConfigured: function () {
        return firebaseConfig.apiKey !== "YOUR_API_KEY" && db !== null;
    },
    
    // Auth Check
    verifyPassword: async function (type, password) {
        if (!this.isConfigured()) return false;
        try {
            const docRef = db.collection('settings').doc('auth');
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data();
                if (type === 'admin') return data.admin_password === password;
                if (type === 'operator') return data.operator_password === password;
            } else {
                // Default fallback if doc doesn't exist yet
                return password === "adiwiyata123" || password === "admin123";
            }
        } catch (e) {
            console.error("Error verifying password:", e);
        }
        return false;
    }
};
