const admin = require("firebase-admin");
const { firebaseConfig } = require('../../config/firebaseApp.config');
const { connectToDatabase } = require('../../../lib/mongodb');

const googleService = JSON.parse(process.env.GOOGLE_SERVICE);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
        databaseURL: firebaseConfig.databaseURL
    });
}
const { wordlist } = require('../../utils/wordlist');
const wordlistLength = wordlist.length;

const { db } = await connectToDatabase();
const usersCollection = db.collection("users");

import Log from "@utils/logger"

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ success: false })
        return
    }

    Log.debug("request! body", req.body)

    let token = "";

    try {
        token = JSON.parse(req.body).token || "";
    } catch (error) {
        Log.error(error);
        return res.status(400).send({ success: false, error: "error-with-token" });
    }

    if (!token) {
        res.status(400).send({ success: false, error: "no-token" })
        return
    }
    try {
        await admin.auth().verifyIdToken(token).then(async (decodedToken) => {
            const user = await usersCollection.findOne({ uid: decodedToken.uid });
            console.log("decodedToken uid: ", decodedToken.uid);
            if (!user) {
                const randomName = wordlist[Math.floor(Math.random() * wordlistLength)] + Math.floor((Math.random() * 1000) + 1);
                const newUser = {
                    uid: decodedToken?.uid,
                    email: decodedToken?.email,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    username: randomName, //decodedToken?.uid,
                    fullname: decodedToken?.name ?? "",
                    bio: "",
                    avatar: decodedToken?.picture ?? "",
                    profileVisible: false,
                    provider: decodedToken?.firebase?.sign_in_provider ?? "",
                }
                await usersCollection.insertOne({ ...newUser });
                res.status(200).send({ success: true, data: { ...newUser } });
            } else {
                if (!user?.provider) {
                    await usersCollection.updateOne({ uid: decodedToken.uid }, { $set: { provider: decodedToken?.firebase?.sign_in_provider } });
                }
                res.status(200).send({
                    success: true,
                    data: {
                        uid: user.uid,
                        _id: user._id,
                        username: user.username,
                        fullname: user.fullname,
                        bio: user.bio,
                        avatar: user.avatar,
                        profileVisible: user.profileVisible,
                        email: user.email,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        provider: user?.provider ?? "",
                    },
                    uid: user.uid
                });
            }
        }).catch(error => {
            Log.debug("Token failure!", error)
            res.status(400).json({ success: false, error: "auth/argument-error" });
            return; // dont run code below
        });
    } catch (error) {
        Log.debug("error validating, err:", error);
        res.status(200).send({ success: false, error });
    }
}
