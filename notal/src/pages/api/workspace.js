const admin = require("firebase-admin");
const { firebaseConfig } = require('../../config/firebaseApp.config');
const { connectToDatabase } = require('../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

const googleService = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
        //databaseURL: firebaseConfig.databaseURL
    });
}

const { db } = await connectToDatabase();
const workspacesCollection = db.collection("workspaces");
const usersCollection = db.collection("users");
//const fieldsCollection = db.collection("fields");

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(400).send({ success: false });
        return;
    }

    const body = JSON.parse(req.body);

    const { uid, title, desc, action, starred, id, workspaceId, color, fieldId, filterBy, swapType, cardId, toFieldId, toCardId, workspaceVisible } = body ?? "";

    const workspaceAction = {
        create: async () => {
            if (!uid) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            try {
                await workspacesCollection.insertOne({
                    title,
                    desc,
                    starred,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    owner: uid,
                    workspaceVisible,
                }).then(() => {
                    res.status(200).send({ success: true });
                });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        get_workspaces: async () => {

            const bearer = req.headers['authorization'];
            if (typeof bearer !== "undefined") {
                const bearerToken = bearer?.split(' ')[1];

                await admin.auth().verifyIdToken(bearerToken).then(async (decodedToken) => {
                    const user = await usersCollection.findOne({ uid: decodedToken.user_id });

                    if (uid) { // if no uid present, find workspaces based on decodedtoken
                        if (uid === user.uid || user?.role === "admin") {
                            try {
                                const workspaces = await workspacesCollection.find({ owner: uid }).toArray();
                                res.status(200).send({ success: true, data: workspaces.map(el => { return { _id: el._id, createdAt: el.createdAt, desc: el.desc, title: el.title, owner: el.owner, starred: el.starred, updatedAt: el.updatedAt, workspaceVisible: el.workspaceVisible } }) });
                            } catch (error) {
                                res.status(200).send({ success: false, error: new Error(error).message });
                            }
                        } else {
                            res.status(400).send({ success: false, error: "invalid-params" });
                        }
                    } else {
                        const workspaces = await workspacesCollection.find({ owner: decodedToken.uid }).toArray();
                        res.status(200).send({ success: true, data: workspaces });
                    }
                }).catch(error => {
                    res.status(400).json({ success: false, error });
                    return; // dont run code below
                });
            } else {
                res.status(400).send({ success: false, error: "invalid-params" });
            }
        },
        get_workspace: async () => {
            console.log("!!!getting workspace with id: ", id);
            if (!id) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }
            const bearer = req.headers['authorization'];
            try {
                const workspace = await workspacesCollection.findOne({ "_id": ObjectId(id) });
                if (!workspace) {
                    res.status(400).send({ success: false, error: "not-found" });
                } else {
                    if (workspace.workspaceVisible) {
                        const user = await usersCollection.findOne({ "uid": workspace.owner });
                        if (user) {
                            res.status(200).send({
                                success: true,
                                data: {
                                    ...workspace,
                                    username: user.username,
                                    fullname: user.fullname ?? "",
                                    avatar: user.avatar ?? ""
                                }
                            });
                        } else {
                            res.status(400).send({ success: false, error: "please report this to erenkulaksz@gmail.com", reason: "workspace owner doesnt match" });
                        }
                    } else {
                        // check bearer
                        if (typeof bearer !== 'undefined') {
                            const bearerToken = bearer?.split(' ')[1];

                            await admin.auth().verifyIdToken(bearerToken).then(async (decodedToken) => {

                                const user = await usersCollection.findOne({ uid: decodedToken.user_id });

                                if (workspace.owner === user.uid || user?.role === "admin") {
                                    try {
                                        res.status(200).send({
                                            success: true,
                                            data: {
                                                ...workspace,
                                                username: user.username,
                                                fullname: user.fullname ?? "",
                                                avatar: user.avatar ?? ""
                                            }
                                        });
                                    } catch (error) {
                                        res.status(400).send({ success: false, error: new Error(error).message });
                                    }
                                } else {
                                    res.status(400).send({ success: false, error: "invalid-params" });
                                }
                            }).catch(error => {
                                res.status(400).json({ success: false, error: error.code == "auth/argument-error" ? "user-workspace-private" : error });
                                return; // dont run code below
                            });
                        } else {
                            res.status(400).send({ success: false, error: "user-workspace-private" });
                        }
                    }
                }
            } catch (error) {
                console.log("error with workspace fetch: ", new Error(error).message);
                res.status(400).send({ success: false, error: "not-found" });
            }
        },
        delete: async () => {
            if (!uid || !id) { // id: workspace
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }
            try {
                await workspacesCollection.deleteOne({ "_id": ObjectId(id) })
                    .then(() => {
                        res.status(200).send({ success: true });
                    });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        star: async () => {
            if (!uid || !id) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            try {
                const workspace = await workspacesCollection.findOne({ "_id": ObjectId(id) })
                await workspacesCollection.updateOne({ "_id": ObjectId(id) }, { $set: { starred: !workspace.starred } })
                    .then(() => {
                        res.status(200).send({ success: true });
                    });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        edit: async () => {
            if (!id || !uid) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            } // uid: owner, id: workspace

            try {
                await workspacesCollection.updateOne({ "_id": ObjectId(id) }, { $set: { title, desc, workspaceVisible } })
                    .then(() => {
                        res.status(200).send({ success: true });
                    });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        addfield: async () => {
            if (!id || !uid || !filterBy) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }
            try {
                await workspacesCollection.updateOne({ "_id": ObjectId(id) }, {
                    $push: {
                        fields: {
                            title,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            filterBy,
                            _id: ObjectId(),
                        }
                    }
                });
                res.status(200).send({ success: true });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        removefield: async () => {
            if (!id || !uid || !workspaceId) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            console.log("Workspace id: ", workspaceId, " id of field: ", id);

            try {
                await workspacesCollection.updateOne({ "_id": ObjectId(workspaceId) }, {
                    $pull: {
                        fields: {
                            "_id": ObjectId(id),
                        }
                    }
                });
                res.status(200).send({ success: true });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        addcard: async () => {

            // id: field id

            console.log(color, title, desc, workspaceId, uid, id);
            if (!id || !uid || !workspaceId || !title /*|| !desc || !color*/) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            try {
                workspacesCollection.findOneAndUpdate({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(id) },
                    {
                        $push: {
                            "fields.$.cards": {
                                title,
                                desc,
                                color,
                                createdAt: Date.now(),
                                updatedAt: Date.now(),
                                _id: ObjectId(),
                            }
                        }
                    }, { returnDocument: 'after' }, (err, documents) => {
                        if (!err) {
                            res.status(200).send({ success: true, data: documents.value.fields });
                        } else {
                            res.status(400).send({ success: false, error: new Error(err).message });
                        }
                    }
                )
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        removecard: async () => {
            if (!id || !uid || !workspaceId || !fieldId) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            try {
                await workspacesCollection.updateOne({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(fieldId) }, {
                    $pull: {
                        "fields.$.cards": {
                            _id: ObjectId(id),
                        }
                    }
                });
                res.status(200).send({ success: true });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        editfield: async () => {
            if (!id || !uid || !workspaceId || !title) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            try {
                await workspacesCollection.updateOne({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(id) }, { $set: { "fields.$.title": title } });
                res.status(200).send({ success: true });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        editcard: async () => {
            console.log("editcard", id, uid, workspaceId, title, fieldId);

            if (!id || !uid || !workspaceId || !title || !fieldId) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            try {
                await workspacesCollection.updateOne(
                    {
                        "_id": ObjectId(workspaceId)
                    },
                    {
                        $set: {
                            "fields.$[i].cards.$[j].title": title,
                            "fields.$[i].cards.$[j].desc": desc,
                            "fields.$[i].cards.$[j].color": color,
                            "fields.$[i].cards.$[j].updatedAt": Date.now(),
                        }
                    },
                    {
                        arrayFilters: [{ "i._id": ObjectId(fieldId) }, { "j._id": ObjectId(id) }]
                    }
                );
                res.status(200).send({ success: true });
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        }
    }

    if (!workspaceAction[action?.toLowerCase()]) {
        res.status(400).send({ success: false, error: "invalid-params-action" });
    } else {
        await workspaceAction[action?.toLowerCase()]();
    }
}
