const admin = require("firebase-admin");
const googleService = JSON.parse(process.env.GOOGLE_SERVICE);

const { connectToDatabase } = require('../../../../lib/mongodb');
const { db } = await connectToDatabase();

import Log from "@utils/logger"

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
        //databaseURL: firebaseConfig.databaseURL
    });
}

const usersCollection = db.collection("users");
const workspacesCollection = db.collection("workspaces");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ success: false });
        return;
    }
    const { username } = req.query;

    try {
        const user = await usersCollection.findOne({ username });
        if (user) {
            let workspaces = [];
            if (user.profileVisible) {
                // dont show private workspaces here
                const bearer = req.headers['authorization'];
                if (typeof bearer !== "undefined") {
                    const bearerToken = bearer?.split(' ')[1];

                    await admin.auth().verifyIdToken(bearerToken).then(async (decodedToken) => {
                        if (decodedToken.uid === user.uid) {
                            try {
                                Log.debug("Verified token!");
                                workspaces = await workspacesCollection.find({ owner: user.uid }).toArray();
                            } catch (error) {
                                workspaces = "auth-error";
                            }
                        } else {
                            // no auth present
                            workspaces = await workspacesCollection.find({ owner: user.uid, workspaceVisible: true }).toArray();
                        }
                    }).catch(async (error) => {
                        // no auth present
                        workspaces = await workspacesCollection.find({ owner: user.uid, workspaceVisible: true }).toArray();
                    });
                } else {
                    // no auth present
                    workspaces = await workspacesCollection.find({ owner: user.uid, workspaceVisible: true }).toArray();
                }
            } else {
                const bearer = req.headers['authorization'];
                if (typeof bearer !== "undefined") {
                    const bearerToken = bearer?.split(' ')[1];

                    await admin.auth().verifyIdToken(bearerToken).then(async (decodedToken) => {
                        if (decodedToken.uid === user.uid || user?.role === "admin") {
                            try {
                                workspaces = await workspacesCollection.find({ owner: user.uid }).toArray();
                            } catch (error) {
                                workspaces = "auth-error";
                            }
                        } else {
                            workspaces = "auth-error";
                        }
                    }).catch(error => {
                        workspaces = "auth-error";
                    });
                } else {
                    workspaces = "user-profile-private";
                }
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
                    createdAt: user.createdAt,
                    workspaces,
                    links: user.links,
                }
            });
        } else {
            res.status(400).send({ success: false, error: "cant-find-user" });
        }
    } catch (error) {
        res.status(200).send({ success: false, error: new Error(error).message });
    }
}
