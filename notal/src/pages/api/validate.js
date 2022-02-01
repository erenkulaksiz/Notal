const admin = require("firebase-admin");
const { firebaseConfig } = require('../../config/firebaseApp.config');
const { connectToDatabase } = require('../../../lib/mongodb');

const googleService = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
        databaseURL: firebaseConfig.databaseURL
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ success: false })
        return
    }

    const { token } = JSON.parse(req.body);

    if (!token) {
        res.status(400).send({ success: false })
        return
    }
    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection("users");

        await admin.auth().verifyIdToken(token).then(async (decodedToken) => {
            const user = await usersCollection.findOne({ uid: decodedToken.uid });
            if (!user) {
                const newUser = {
                    uid: decodedToken?.uid,
                    email: decodedToken?.email,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    username: decodedToken?.uid,
                    fullname: "",
                    bio: "",
                    avatar: decodedToken?.photoURL || "",
                    profileVisible: false,
                }
                await usersCollection.insertOne({ ...newUser });
                res.status(200).send({ success: true, data: { ...newUser } });
            } else {
                res.status(200).send({ success: true, data: user, uid: user.uid });
            }
        }).catch(error => {
            console.log("error with jwt validate: ", error);
            res.status(200).json({ success: false, error });
            return; // dont run code below
        });
    } catch (error) {
        res.status(200).send({ success: false, error: new Error(error).message });
    }
}
