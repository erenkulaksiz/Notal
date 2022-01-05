import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from '../config/firebaseApp.config.js';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

if (!getApps.length) {
    const app = initializeApp(firebaseConfig);
    if (typeof windows != "undefined") {
        if ("measurementId" in firebaseConfig) {
            const analytics = getAnalytics(app);
            const database = getDatabase(app);
            const storage = getStorage(app);
        }
    }
}

