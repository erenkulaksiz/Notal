const admin = require("firebase-admin");
const { firebaseConfig } = require('../../../config/firebaseApp.config');

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
    }
    const { username } = req.query;

    await admin.database().ref(`/users`).orderByChild("username").equalTo(username).limitToFirst(1).once("value", async (snapshot) => {
        if (snapshot.exists()) {
            console.log("find username : ", snapshot.val());
            const data = snapshot.val()[Object.keys(snapshot.val())[0]];
            const newData = {
                avatar: data.avatar,
                bio: data.bio,
                email: data.email,
                username: data.username,
                profileVisible: data.profileVisible,
                fullname: data.fullname,
            }
            res.status(400).json({ success: true, data: newData, uid: Object.keys(snapshot.val())[0] });
        } else {
            res.status(400).json({ success: false, error: "cant-find-user" });
        }
    });
}
