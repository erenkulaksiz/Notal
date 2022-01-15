const admin = require("firebase-admin");
const { firebaseConfig } = require('../../config/firebaseApp.config');

const googleService = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
        databaseURL: firebaseConfig.databaseURL
    });
}

export default async function handler(req, res) {
    const data = JSON.parse(req.body);
    if (req.method !== 'POST' || !data.uid || !data.paac) {
        res.status(400).send({ success: false });
    }

    // UNNECCESARY CHECK HERE, FIX IT LATEER

    await admin.database().ref(`/paacodes`).orderByChild("code").equalTo(data.paac).limitToFirst(1).once("value", async (snapshot) => {
        if (snapshot.exists()) {
            await admin.database().ref(`/users/${data.uid}`).update({ paac: data.paac }).then(() => {
                res.status(400).json({ success: true });
            }).catch((error) => {
                res.status(400).json({ success: false, error });
            })
        } else {
            res.status(400).json({ success: false, error: "paac/invalid-code" });
        }
    }).catch(error => {
        res.status(400).json({ success: false, error });
    });
}
