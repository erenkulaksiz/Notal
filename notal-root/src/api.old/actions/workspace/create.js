const admin = require("firebase-admin");
const { connectToDatabase } = require('../../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

const googleService = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
    });
}

import { Log } from "@utils";

const { db } = await connectToDatabase();
const workspacesCollection = db.collection("workspaces");

const CreateWorkspace = ({ req, res, uid, title, desc, starred, workspaceVisible, thumbnail }) => {
    if (!uid) {
        res.status(400).send({ success: false, error: "invalid-params" });
        return;
    }

    try {
        return await workspacesCollection.insertOne({
            title,
            desc,
            starred,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            owner: uid,
            workspaceVisible,
            thumbnail,
        }).then(async (result) => {
            const resId = result.insertedId;
            Log.debug("updating id: ", resId);
            Log.debug("thumbnail: ", thumbnail);

            if (thumbnail?.type == "image") {
                // move from temp to real location
                const storageRef = admin.storage().bucket("gs://notal-1df19.appspot.com");
                const file = storageRef.file(`thumbnails/temp/workspace_${uid}`);
                const fileExist = await file.exists();
                if (fileExist[0]) {
                    await file.move(`thumbnails/workspace_${resId}`);
                    const newFile = storageRef.file(`thumbnails/workspace_${resId}`);
                    //const meta = await newFile.getMetadata();
                    const url = await newFile.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    });
                    return await workspacesCollection.updateOne({ _id: ObjectId(resId) }, { $set: { thumbnail: { type: "image", file: url[0] } } })
                        .then(() => { return res.status(200).send({ success: true }); })
                        .catch(error => { return res.status(400).send({ success: false, error }); });
                } else {
                    return res.status(200).send({ success: true });
                }
            } else {
                return res.status(200).send({ success: true });
            }
        });
    } catch (error) {
        return res.status(400).send({ success: false, error });
    }
}

module.exports = {
    CreateWorkspace,
}