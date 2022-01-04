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
    if (req.method !== 'POST' || !data.uid || !data.fullname) {
        res.status(400).send({ success: false });
    }

    await admin.database().ref(`/users/${data.uid}`).update({
        fullname: data.fullname,
    }, () => {
        res.status(200).json({ success: true, data: { username: data.username, fullname: data.fullname, uid: data.uid } });
    }).catch(err => {
        res.status(400).json({ success: false, error: err });
    });
}
