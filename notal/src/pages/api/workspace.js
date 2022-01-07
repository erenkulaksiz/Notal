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

    const { uid, title, desc, action, starred, id } = JSON.parse(req.body);

    if (action == "CREATE") {

        if (!uid || !action) {
            res.status(400).send({ success: false })
            return;
        }

        const ref = await admin.database().ref(`/workspaces`).push();
        await ref.set({
            title, desc, starred, createdAt: Date.now(), updatedAt: Date.now(), owner: uid
        });
        res.status(200).send({ success: true });
    } else if (action == "GET_WORKSPACES") {
        const { uid } = JSON.parse(req.body);

        if (!uid) {
            res.status(400).send({ success: false });
            return;
        }

        await admin.database().ref(`/workspaces`).orderByChild("owner").equalTo(uid).once("value", async (snapshot) => {
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

        await admin.database().ref(`/workspaces/${id}`).once("value", async (snapshot) => {
            if (snapshot.exists()) {
                await admin.database().ref(`/workspaces/${id}`).remove(() => {
                    res.status(200).send({ success: true });
                }).catch(error => {
                    res.status(400).send({ success: false, error });
                });
            } else {
                res.status(400).send({ success: false });
            }
        });
    } else if (action == "STAR") {

        if (!uid || !id) {
            res.status(400).send({ success: false });
            return;
        }

        await admin.database().ref(`/workspaces`).orderByKey().equalTo(id).once("value", async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()[Object.keys(snapshot.val())[0]];

                const starred = !data.starred;

                if (data.owner == uid) {

                    await admin.database().ref(`/workspaces/${id}`).update({ starred, updatedAt: Date.now() }, () => {
                        res.status(200).send({ success: true });
                    }).catch(error => {
                        res.status(400).send({ success: false, error });
                    });
                } else {
                    res.status(400).send({ success: false, error: "unauthorized" });
                }
            } else {
                res.status(400).send({ success: false });
            }
        }).catch(error => {
            res.status(400).send({ success: false, error });
        });
    } else if (action == "GET_WORKSPACE") {

        if (!id) {
            res.status(400).send({ success: false });
            return;
        }

        await admin.database().ref(`/workspaces/${id}`).once("value", async (snapshot) => {
            if (snapshot.exists()) {
                res.status(200).send({ success: true, data: snapshot.val() });
            } else {
                res.status(400).send({ success: false });
            }
        }).catch(error => {
            res.status(400).send({ success: false, error });
        });
    }
}
