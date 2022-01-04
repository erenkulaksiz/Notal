const admin = require("firebase-admin");
const { firebaseConfig } = require('../../config/firebaseApp.config');

const googleService = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE);

console.log("googleService: ", googleService);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
        databaseURL: firebaseConfig.databaseURL
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST' || !JSON.parse(req.body).token) {
        res.status(400).send({ success: false })
        return
    }

    const { token } = JSON.parse(req.body);

    const data = await admin.auth().verifyIdToken(token).catch(err => {
        console.log("error: ", err);
        res.status(200).json({ success: false, error: err });
    })

    console.log("Data:", data);

    /*
    if (data.firebase.sign_in_provider === "password") {
        res.status(200).json({ success: true });
    }
    */

    await admin.database().ref(`/users/${data.uid}`).once("value", async (snapshot) => {
        if (snapshot.exists()) {
            console.log("data: ", snapshot.val());
            res.status(200).json({ success: true, data: snapshot.val() });
        } else {
            console.log("trying to create user");
            if (data.firebase.sign_in_provider != "password") {
                return await admin.database().ref(`/users/${data.uid}`).set({
                    fullname: data.name || "",
                    avatar: data.picture || "https://imgur.com/jNNT4LE",
                    email: data.email,
                }, async () => {
                    return await admin.database().ref(`/users/${data.uid}`).once("value", async (snapshot) => {
                        if (snapshot.exists()) {
                            res.status(200).json({ success: true, data: snapshot.val() });
                        } else {
                            res.status(200).json({ success: false });
                        }
                    }).catch(err => res.status(400).json({ success: false, error: err }));
                }).catch(err => res.status(400).json({ success: false, error: err }));
            } else {
                res.status(200).json({ success: true, data: data });
            }
        }
    }).catch(err => {
        console.log("error! ", err);
        res.status(400).json({ success: false, error: err });
    });
}
