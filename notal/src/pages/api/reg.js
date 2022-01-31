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

    if (req.method !== 'POST') {
        res.status(400).send({ success: false });
        return;
    }

    const data = JSON.parse(req.body);

    if (!data.uid || !data.username) {
        res.status(400).send({ success: false });
        return;
    }

    if (data.username.length > 20) {
        res.status(400).json({ success: false, error: "auth/username-too-long" });
        return;
    } else if (data.username.length < 3) {
        res.status(400).json({ success: false, error: "auth/username-too-short" });
        return;
    } else if ((/\s/).test(data.username)) {
        // check for spaces in username
        res.status(400).json({ success: false, error: "auth/username-contains-space" });
        return;
    }

    await admin.database().ref(`/users`).orderByChild("username").equalTo(data.username).limitToFirst(1).once("value", async (snapshot) => {
        if (snapshot.exists()) {
            console.log("find username : ", snapshot.val());
            res.status(400).json({ success: false, error: "auth/username-already-in-use" });
        } else {
            await admin.database().ref(`/users/${data.uid}`).update({
                username: data.username,
                fullname: data.fullname,
                updatedAt: Date.now(),
            }, () => {
                res.status(200).json({ success: true, data: { username: data.username, fullname: data.fullname, uid: data.uid } });
            }).catch(err => {
                res.status(400).json({ success: false, error: err });
            });
        }
    }).catch(err => {
        res.status(400).json({ success: false, error: err });
    });
}
