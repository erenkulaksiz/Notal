import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from '../config/firebaseApp.config.js';
import { getAnalytics } from "firebase/analytics";

if (!getApps.length) {
    const app = initializeApp(firebaseConfig);
    if (typeof windows != "undefined") {
        if ("measurementId" in firebaseConfig) {
            const analytics = getAnalytics(app);
            const database = getDatabase(app);
        }
    }
}

