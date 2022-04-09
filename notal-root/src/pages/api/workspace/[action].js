const admin = require("firebase-admin");
const { connectToDatabase } = require('../../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

const { customAlphabet } = require('nanoid')

const googleService = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
    });
}

const { db } = await connectToDatabase();
const workspacesCollection = db.collection("workspaces");
const usersCollection = db.collection("users");

const checkBearer = async (bearer) => {
    const bearerToken = bearer?.split(' ')[1];
    if (typeof bearerToken == "undefined") return false;
    try {
        const decodedToken = await admin.auth().verifyIdToken(bearerToken);
        if (typeof decodedToken == "undefined") return false;
        return decodedToken;
    } catch (error) {
        console.log("verifyIdToken Error CheckToken: ", error);
        return false;
    }
}

export default async function handler(req, res) {

    const reject = (reason = "invalid-params", status = 400) => {
        return res.status(status).send({ success: false, error: reason });
    }

    const accept = (data = {}, status = 200) => {
        return res.status(status).send({ success: true, data });
    }

    if (req.method !== 'POST') {
        return reject();
    }

    const WORKSPACE_ACTION = req.query.action;

    const body = JSON.parse(req.body);

    const { uid, title, desc, starred, id, workspaceId, color, fieldId, sortBy, workspaceVisible, tag, thumbnail, field, username, userId } = body ?? "";

    const workspaceAction = {
        createworkspace: async () => {
            if (!uid || !thumbnail) {
                return reject();
            }

            if (title?.length > 32) {
                return reject("title-maxlength");
            }
            if (desc?.length > 96) {
                return reject("desc-maxlength");
            }

            try {
                // first check how many workspaces user have
                const workspacesCount = await workspacesCollection.find({ owner: uid }).count();

                if (workspacesCount >= 20) {
                    return reject("max-workspaces");
                }

                let givenId = false;
                let length = 4; // default id length

                while (givenId == false) {
                    // create workspace UID
                    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
                    const id = await nanoid();

                    const checkIdExist = await workspacesCollection.findOne({ "id": id });
                    if (checkIdExist) {
                        length++;
                        return;
                    }
                    givenId = id;
                    // if id exist
                }

                console.log("generated ID for workspace: ", givenId, " owner: ", uid);

                return await workspacesCollection.insertOne({
                    title,
                    desc,
                    starred,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    owner: uid,
                    workspaceVisible,
                    thumbnail,
                    users: [uid], // Add owner as default user 
                    id: givenId,
                }).then(async (result) => {
                    const resId = result.insertedId;
                    console.log("updating id: ", resId);
                    console.log("thumbnail: ", thumbnail);

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
                                .catch(error => { return reject(error) });
                        } else {
                            return res.status(200).send({ success: true });
                        }
                    } else {
                        return res.status(200).send({ success: true });
                    }
                });
            } catch (error) {
                return reject(error);
            }
        },
        getworkspaces: async () => {
            const decodedToken = await checkBearer(req.headers['authorization']);

            if (!decodedToken) return reject("invalid-token");

            const user = await usersCollection.findOne({ uid: decodedToken.user_id });

            if (uid) { // if no uid present, find workspaces based on decodedtoken
                if (uid === user.uid || user?.role === "admin") {
                    try {
                        const workspaces = await workspacesCollection.find({ owner: uid }).toArray();
                        res.status(200).send({
                            success: true,
                            data: workspaces.map(el => {
                                return {
                                    _id: el._id,
                                    id: el?.id,
                                    createdAt: el.createdAt,
                                    desc: el.desc,
                                    title: el.title,
                                    owner: el.owner,
                                    starred: el.starred,
                                    updatedAt: el.updatedAt,
                                    workspaceVisible: el.workspaceVisible,
                                    thumbnail: el.thumbnail,
                                }
                            })
                        });
                    } catch (error) {
                        return reject(error);
                    }
                } else {
                    return reject();
                }
            } else {
                const workspaces = await workspacesCollection.find({ owner: decodedToken.uid }).toArray();
                res.status(200).send({
                    success: true,
                    data: workspaces.map(el => {
                        return {
                            _id: el._id,
                            id: el?.id,
                            createdAt: el.createdAt,
                            desc: el.desc,
                            title: el.title,
                            owner: el.owner,
                            starred: el.starred,
                            updatedAt: el.updatedAt,
                            workspaceVisible: el.workspaceVisible,
                            thumbnail: el.thumbnail,
                        }
                    })
                });
            }
        },
        getworkspace: async () => {
            console.log("!!!getting workspace with id: ", id);
            if (!id) return reject("invalid-params");

            try {
                const workspace = await workspacesCollection.findOne({ "id": id });
                if (!workspace) return reject("not-found")

                if (!workspace.users) {
                    // Add owner if theres no users exist
                    await workspacesCollection.updateOne({ "id": id }, {
                        $set: {
                            users: [workspace.owner],
                        }
                    });
                }

                if (workspace?.users) {
                    // add owner if its not into users
                    if (workspace?.users?.findIndex(el => el == workspace.owner) == -1) {
                        await workspacesCollection.updateOne({ _id: ObjectId(id) }, {
                            $push: {
                                users: workspace.owner,
                            }
                        });
                    }
                }

                if (workspace.workspaceVisible) {
                    const workspaceUsers = workspace.users ?? [];
                    console.log("users: ", workspaceUsers);
                    const wUsers = await usersCollection.find({ "uid": { $in: workspaceUsers } }).toArray();

                    console.log("!!!wuser: ", wUsers);

                    const newWUsers = wUsers.map(el => {
                        return {
                            uid: el.uid,
                            username: el.username,
                            updatedAt: el.updatedAt,
                            createdAt: el.createdAt,
                            fullname: el.fullname,
                            avatar: el.avatar,
                        }
                    });

                    const user = await usersCollection.findOne({ "uid": workspace.owner });
                    if (user) {
                        res.status(200).send({
                            success: true,
                            data: {
                                ...workspace,
                                ownerUser: {
                                    username: user.username,
                                    fullname: user.fullname ?? "",
                                    avatar: user.avatar ?? ""
                                },
                                users: newWUsers
                            }
                        });
                    } else {
                        res.status(400).send({ success: false, error: "please report this to erenkulaksz@gmail.com", reason: "workspace owner doesnt match" });
                    }
                } else {
                    // check bearer

                    const decodedToken = await checkBearer(req.headers['authorization']);

                    if (!decodedToken) return reject("user-workspace-private");

                    const user = await usersCollection.findOne({ uid: decodedToken.user_id });
                    if (workspace.owner === user.uid || user?.role === "admin") {
                        try {
                            const workspaceUsers = workspace.users ?? [];
                            console.log("users: ", workspaceUsers);
                            const wUsers = await usersCollection.find({ "uid": { $in: workspaceUsers } }).toArray();

                            console.log("!!!wuser: ", wUsers);

                            const newWUsers = wUsers.map(el => {
                                return {
                                    uid: el.uid,
                                    username: el.username,
                                    updatedAt: el.updatedAt,
                                    createdAt: el.createdAt,
                                    fullname: el.fullname,
                                    avatar: el.avatar,
                                }
                            });

                            res.status(200).send({
                                success: true,
                                data: {
                                    ...workspace,
                                    ownerUser: {
                                        username: user.username,
                                        fullname: user.fullname ?? "",
                                        avatar: user.avatar ?? ""
                                    },
                                    users: newWUsers,
                                }
                            });
                        } catch (error) {
                            res.status(400).send({ success: false, error: new Error(error).message });
                        }
                    } else {
                        res.status(400).send({ success: false, error: "invalid-params" });
                    }
                }
            } catch (error) {
                console.log("error with workspace fetch: ", new Error(error).message);
                res.status(400).send({ success: false, error: "not-found" });
            }
        },
        getworkspacedata: async () => {
            // get workspace data not including field and card data
            if (!id) return reject("invalid-params");

            // #TODO: dont use try catch
            // #TODO: dont send workspace data if workspace is not visible

            try {
                const workspace = await workspacesCollection.findOne({ "id": id });
                if (!workspace) return reject("not-found");

                const workspaceOwner = await usersCollection.findOne({ "uid": workspace.owner });
                if (!workspaceOwner) return reject("owner-not-found");

                if (!workspace.workspaceVisible) {
                    const decodedToken = await checkBearer(req.headers['authorization']);
                    if (decodedToken.user_id != workspace.owner) {
                        return reject("not-found");
                    }
                }

                return accept({
                    title: workspace?.title,
                    desc: workspace?.desc,
                    thumbnail: workspace?.thumbnail,
                    owner: {
                        username: workspaceOwner?.username,
                        fullname: workspaceOwner?.fullname ?? "",
                        avatar: workspaceOwner?.avatar ?? "",
                    },
                    id: workspace?.id,
                    starred: workspace?.starred,
                    updatedAt: workspace?.updatedAt,
                    workspaceVisible: workspace?.workspaceVisible,

                });
            } catch (error) {
                return reject(error);
            }
        },
        removeworkspace: async () => {
            if (!uid || !id) return reject("invalid-params");
            try {
                return await workspacesCollection.deleteOne({ "_id": ObjectId(id) })
                    .then(() => {
                        return accept();
                    });
            } catch (error) {
                return reject(error);
            }
        },
        starworkspace: async () => {
            if (!uid || !id) return reject("invalid-params");

            try {
                const workspace = await workspacesCollection.findOne({ "_id": ObjectId(id) })
                return await workspacesCollection.updateOne({ "_id": ObjectId(id) },
                    {
                        $set: {
                            starred: !workspace.starred,
                            updatedAt: Date.now(),
                        }
                    })
                    .then(() => {
                        return accept();
                    });
            } catch (error) {
                return reject(error);
            }
        },
        editworkspace: async () => {
            if (!id || !uid) return reject("invalid-params");

            try {
                if (thumbnail?.type != "image") {
                    await workspacesCollection.updateOne({ "_id": ObjectId(id) }, {
                        $set: {
                            title,
                            desc,
                            workspaceVisible,
                            updatedAt: Date.now(),
                            thumbnail,
                        }
                    })
                        .then(() => {
                            res.status(200).send({ success: true });
                        });
                } else if (thumbnail.type == "image") {
                    const storageRef = admin.storage().bucket("gs://notal-1df19.appspot.com");
                    const file = storageRef.file(`thumbnails/temp/workspace_${uid}`);
                    const fileExist = await file.exists();
                    if (fileExist[0]) {
                        await file.move(`thumbnails/workspace_${id}`);
                        const newFile = storageRef.file(`thumbnails/workspace_${id}`);
                        //const meta = await newFile.getMetadata();
                        const url = await newFile.getSignedUrl({
                            action: 'read',
                            expires: '03-09-2491'
                        });
                        return await workspacesCollection.updateOne({ _id: ObjectId(id) }, {
                            $set: {
                                title,
                                desc,
                                workspaceVisible,
                                updatedAt: Date.now(),
                                thumbnail: { type: "image", file: url[0] }
                            }
                        })
                            .then(() => { return res.status(200).send({ success: true }); })
                            .catch(error => { return res.status(400).send({ success: false, error }); });
                    } else {
                        return await workspacesCollection.updateOne({ _id: ObjectId(id) }, {
                            $set: {
                                title,
                                desc,
                                workspaceVisible,
                                updatedAt: Date.now(),
                                thumbnail: thumbnail,
                            }
                        })
                            .then(() => { return res.status(200).send({ success: true }); })
                            .catch(error => { return res.status(400).send({ success: false, error }); });
                    }
                }
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        addfield: async () => {
            if (!id || !uid || !sortBy) return reject("invalid-params");

            if (title.length > 28) return reject("title-maxlength");

            try {
                const bearer = req.headers['authorization'];
                const bearerToken = bearer?.split(' ')[1];
                if (typeof bearerToken !== 'undefined') {
                    await admin.auth().verifyIdToken(bearerToken).then(async (decodedToken) => {
                        const user = await usersCollection.findOne({ uid });
                        if (user.uid == decodedToken.user_id) {

                            const _workspace = await workspacesCollection.findOne({ "_id": ObjectId(id) });
                            console.log("workspace: ", _workspace);
                            const _workspaceUsers = _workspace.users ?? [];

                            console.log("workspaceUsers", _workspaceUsers);

                            if (_workspaceUsers?.findIndex(el => el == uid) == -1 || _workspaceUsers.length == 0) {
                                // this user doesnt exist on workspace
                                _workspaceUsers.push(uid);
                            }

                            await workspacesCollection.updateOne({ "_id": ObjectId(id) }, {
                                $push: {
                                    fields: {
                                        title,
                                        createdAt: Date.now(),
                                        updatedAt: Date.now(),
                                        sortBy,
                                        owner: uid,
                                        cards: [],
                                        _id: ObjectId(),
                                    }
                                },
                                $set: {
                                    users: [..._workspaceUsers],
                                }
                            });

                            res.status(200).send({ success: true });
                        } else {
                            res.status(400).send({ success: false, error: "invalid-params" });
                        }
                    })
                } else {
                    res.status(400).send({ success: false, error: "no-token" });
                }
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        removefield: async () => {
            if (!id || !uid || !workspaceId) return reject("invalid-params");
            console.log("Workspace id: ", workspaceId, " id of field: ", id);

            try {
                await workspacesCollection.updateOne({ "_id": ObjectId(workspaceId) }, {
                    $pull: {
                        fields: {
                            "_id": ObjectId(id),
                        }
                    }
                });
                return accept();
            } catch (error) {
                return reject(error);
            }
        },
        addcard: async () => {
            // id: field id
            if (!id || !uid || !workspaceId || !title) return reject("invalid-params");
            if (color && color.length > 7) return reject("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            if (thumbnail && thumbnail?.type == "gradient" && (thumbnail?.colors?.start?.length > 7 || thumbnail?.colors?.end?.length > 7)) return reject("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            if (title?.length > 40) return reject("title-maxlength");
            if (desc?.length > 356) return reject("desc-maxlength");

            const decodedToken = await checkBearer(req.headers['authorization']);

            if (!decodedToken) return reject("invalid-token");

            const user = await usersCollection.findOne({ uid });
            if (user.uid == decodedToken.user_id) {
                workspacesCollection.findOneAndUpdate({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(id) },
                    {
                        $push: {
                            "fields.$.cards": {
                                title,
                                desc,
                                color,
                                createdAt: Date.now(),
                                updatedAt: Date.now(),
                                tag: {
                                    tag: tag.tag,
                                    tagColor: tag.tagColor,
                                },
                                owner: uid,
                                _id: ObjectId(),
                            }
                        }
                    }, (error) => {
                        if (!error) {
                            return accept();
                        } else {
                            return reject(error);
                        }
                    }
                )
            } else {
                return reject("invalid-token");
            }
        },
        removecard: async () => {
            if (!id || !uid || !workspaceId || !fieldId) return reject("invalid-params");

            try {
                await workspacesCollection.updateOne({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(fieldId) }, {
                    $pull: {
                        "fields.$.cards": {
                            _id: ObjectId(id),
                        }
                    },
                    $set: {
                        "fields.$.updatedAt": Date.now(),
                    }
                });
                return accept();
            } catch (error) {
                return reject(error);
            }
        },
        editfield: async () => {
            if (!uid || !workspaceId || !field) return reject("invalid-params");

            try {
                await workspacesCollection.updateOne(
                    { "_id": ObjectId(workspaceId), "fields._id": ObjectId(field._id) },
                    {
                        $set: {
                            "fields.$.title": field?.title,
                            "fields.$.filterBy": field?.filterBy,
                            "fields.$.collapsed": field?.collapsed,
                            "fields.$.updatedAt": Date.now(),
                        }
                    });
                return accept();
            } catch (error) {
                return reject(error);
            }
        },
        editcard: async () => {
            console.log("editcard", id, uid, workspaceId, title, fieldId);

            if (!id || !uid || !workspaceId || !title || !fieldId) return reject("invalid-params");

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
                return accept();
            } catch (error) {
                return reject(error);
            }
        },
        adduser: async () => {
            console.log("adduser", id, uid, username);

            if (!id || !uid || !username) return reject("invalid-params");

            try {
                const user = await usersCollection.findOne({ "username": username });

                if (!user) return reject("user-not-found");

                const workspace = await workspacesCollection.findOne({ "_id": ObjectId(id) });

                if (!workspace) return reject("workspace-not-found");

                if (workspace?.users.findIndex(el => el == user.uid) != -1) return reject("user-already-added")

                await workspacesCollection.updateOne(
                    {
                        "_id": ObjectId(id)
                    },
                    {
                        $set: {
                            updatedAt: Date.now(),
                        },
                        $push: {
                            "users": user.uid
                        }
                    }
                );
                return accept();
            } catch (error) {
                return reject(error);
            }
        },
        removeuser: async () => {
            console.log("removeuser", id, uid);

            if (!id || !uid || !userId) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            try {
                await workspacesCollection.updateOne(
                    {
                        "_id": ObjectId(id)
                    },
                    {
                        $pull: {
                            users: userId,
                        },
                        $set: {
                            updatedAt: Date.now(),
                        }
                    }
                );
                return accept()
            } catch (error) {
                return reject(error);
            }
        }
    }

    const WPAction = workspaceAction[WORKSPACE_ACTION?.toLowerCase()]

    if (!WPAction) {
        return reject("invalid-params");
    } else {
        return await WPAction();
    }
}
