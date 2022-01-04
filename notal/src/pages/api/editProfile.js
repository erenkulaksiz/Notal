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
    if (req.method !== 'POST' || !data.uid || !data.fullname || !data.username) {
        res.status(400).send({ success: false });
    }

    await admin.database().ref(`/users`).orderByChild("username").equalTo(data.username).limitToFirst(1).once("value", async (snapshot) => {
        if (snapshot.exists()) {
            if (Object.keys(snapshot.val())[0] == data.uid) {

                await admin.database().ref(`/users/${data.uid}`).update({
                    fullname: data.fullname,
                    bio: (snapshot.val()[Object.keys(snapshot.val())[0]].bio != data?.bio) ? data.bio : "",
                }, () => {
                    res.status(200).json({ success: true, data: { username: data.username, fullname: data.fullname, uid: data.uid } });
                }).catch(err => {
                    res.status(400).json({ success: false, error: err });
                });

            } else {
                res.status(400).json({ success: false, error: "auth/username-already-in-use" });
            }
        } else {
            await admin.database().ref(`/users/${data.uid}`).update({
                fullname: data.fullname,
                username: data.username,
            }, () => {
                res.status(200).json({ success: true, data: { username: data.username, fullname: data.fullname, uid: data.uid } });
            }).catch(err => {
                res.status(400).json({ success: false, error: err });
            });
        }
    });
}