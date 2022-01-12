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

    if (req.method !== 'POST' || !JSON.parse(req.body).token) {
        res.status(400).send({ success: false })
        return
    }
    const { token } = JSON.parse(req.body);

    await admin.auth().verifyIdToken(token).then(async (decodedToken) => {
        await admin.database().ref(`/users/${decodedToken.uid}`).once("value", async (snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json({ success: true, data: snapshot.val(), uid: decodedToken.uid });
            } else {
                if (data.firebase.sign_in_provider != "password") {
                    console.log("trying to create user (not password login)");
                    return await admin.database().ref(`/users/${decodedToken.uid}`).update({
                        fullname: data.name || "",
                        avatar: data.picture || "https://imgyukle.com/f/2022/01/03/oxgaeS.jpg",
                        email: data.email,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    }, async () => {
                        return await admin.database().ref(`/users/${decodedToken.uid}`).once("value", async (snapshot) => {
                            if (snapshot.exists()) {
                                res.status(200).json({ success: true, data: snapshot.val(), uid: decodedToken.uid });
                            } else {
                                res.status(200).json({ success: false });
                            }
                        }).catch(err => res.status(400).json({ success: false, error: err }));
                    }).catch(err => res.status(400).json({ success: false, error: err }));
                } else {
                    res.status(200).json({ success: true, data: decodedToken, });
                }
            }
        }).catch(err => {
            console.log("error! ", err);
            res.status(400).json({ success: false, error: err });
        });
    }).catch(error => {
        console.log("error with jwt validate: ", error);
        res.status(200).json({ success: false, error });
        return; // dont run code below
    });

}
