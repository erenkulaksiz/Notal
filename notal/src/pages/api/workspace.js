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

    const { uid, title, desc, action, starred, id } = JSON.parse(req.body);

    if (!uid || !action) {
        res.status(400).send({ success: false })
        return;
    }

    if (action == "CREATE") {
        const ref = await admin.database().ref(`/workspaces/${uid}`).push();
        await ref.set({
            title, desc, starred, createdAt: Date.now(), updatedAt: Date.now(),
        });
        res.status(200).send({ success: true });
    } else if (action == "GET") {
        const { uid } = JSON.parse(req.body);

        if (!uid) {
            res.status(400).send({ success: false });
            return;
        }

        await admin.database().ref(`/workspaces/${uid}`).once("value", async (snapshot) => {
            if (snapshot.exists()) {
                res.status(200).send({ success: true, data: snapshot.val() });
            } else {
                res.status(200).send({ success: true });
            }
        });
    } else if (action == "DELETE") {

        if (!uid) {
            res.status(400).send({ success: false });
            return;
        }

        await admin.database().ref(`/workspaces`).child(uid).child(id).remove(() => {
            res.status(200).send({ success: true });
        }).catch(error => {
            res.status(400).send({ success: false, error })
        });
    } else if (action == "STAR") {

        if (!uid) {
            res.status(400).send({ success: false });
            return;
        }

        await admin.database().ref(`/workspaces`).child(uid).child(id).once("value", async (snapshot) => {
            if (snapshot.exists()) {
                const starred = !snapshot.val().starred;

                await admin.database().ref(`/workspaces`).child(uid).child(id).update({ starred, updatedAt: Date.now() }, () => {
                    res.status(200).send({ success: true });
                }).catch(error => {
                    res.status(400).send({ success: false, error });
                });
            } else {
                res.status(400).send({ success: false });
            }
        }).catch(error => {
            res.status(400).send({ success: false, error });
        });
    }
}
