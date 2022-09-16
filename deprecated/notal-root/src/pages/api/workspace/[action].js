const admin = require("firebase-admin");
const { connectToDatabase } = require('../../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

const { customAlphabet } = require('nanoid')

const googleService = JSON.parse(process.env.GOOGLE_SERVICE);

import Log from "@utils/logger"

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
        if (typeof decodedToken == "undefined" || !decodedToken) return false;
        return decodedToken;
    } catch (error) {
        Log.debug("verifyIdToken Error CheckToken: ", error);
        return false;
    }
}

export default async function handler(req, res) {

    const reject = (reason = "invalid-params", status = 400) => {
        Log.debug("reject: ", reason);
        return res.status(status).send({ success: false, error: reason });
    }

    const accept = (data, status = 200, action) => {
        Log.debug("accept: ", data, status, action);
        if (data) return res.status(status).send({ success: true, data, });
        return res.status(status).send({ success: true });
    }

    /**
     * Checks whether the request made from workspace owner or not
     * @param {string} workspaceId
     * @returns {object} _workspace
     */
    const checkWorkspaceOwner = async (workspaceId) => {
        const _workspace = await workspacesCollection.findOne({ "_id": ObjectId(workspaceId), _deleted: { $in: [null, false] } });
        const _decodedToken = await checkBearer(req.headers['authorization']);
        if (!_workspace || !_decodedToken) return false; // if either one doesnt exist, return false
        if (_workspace.owner != _decodedToken.user_id) return false;
        return _workspace;
    }

    if (req.method !== 'POST') {
        return reject();
    }

    const WORKSPACE_ACTION = req.query.action;

    let body = {};
    try {
        body = JSON.parse(req.body);
    } catch (error) {
        return reject();
    }

    const { uid, title, desc, starred, id, workspaceId, color, fieldId, sortBy, workspaceVisible, tags, thumbnail, field, userId, username, image, destination, source } = body ?? {};

    const workspaceAction = {
        createworkspace: async () => {
            if (!uid || !thumbnail) {
                return reject();
            }

            if (title?.length > 32) return reject("title-maxlength")
            if (desc?.length > 96) return reject("desc-maxlength")
            if (title?.length < 3) return reject("title-minlength")
            if (thumbnail?.type == "singleColor" && thumbnail?.color.length > 7) return reject("invalid-color");
            else if (thumbnail?.type == "gradient" && (thumbnail?.colors?.start?.length > 7 || thumbnail?.colors?.end?.length > 7)) return reject("invalid-color");

            try {
                // first check how many workspaces user have
                const workspacesCount = await workspacesCollection.find({ owner: uid }).count();

                if (workspacesCount >= 20) return reject("max-workspaces");

                let givenId = false;
                let length = 4; // default id length

                /**
                 * Dynamic ID generator
                 */
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
                }
                // if id doesnt exist

                Log.debug("generated ID for workspace: ", givenId, " owner: ", uid);

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
                                .then(() => accept())
                                .catch(error => { return reject(error) });
                        } else {
                            return accept();
                        }
                    } else {
                        return accept();
                    }
                });
            } catch (error) {
                return reject(error);
            }
        },
        getworkspaces: async () => {
            // #TODO: refactor here

            const decodedToken = await checkBearer(req.headers['authorization']);
            if (!decodedToken) return reject("invalid-token");
            const user = await usersCollection.findOne({ uid: decodedToken.user_id });

            if (uid) {
                if (uid === user.uid || user?.role === "admin") {
                    try {
                        const workspaces = await workspacesCollection.find({ owner: uid, _deleted: { $in: [null, false] } }).toArray();
                        return accept(workspaces.map(el => {
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
                        }));
                    } catch (error) {
                        return reject(error);
                    }
                } else {
                    return reject();
                }
            } else { // if no uid present, find workspaces based on decodedtoken
                const workspaces = await workspacesCollection.find({ owner: decodedToken.uid, _deleted: { $in: [null, false] } }).toArray();
                return accept(
                    workspaces.map(el => {
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
                );
            }
        },
        getworkspace: async () => {
            if (!id) return reject("invalid-params");
            Log.debug("!!!getting workspace with id: ", id);

            try {
                const workspace = await workspacesCollection.findOne({ "id": id, _deleted: { $in: [null, false] } });
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
                    Log.debug("users: ", workspaceUsers);
                    const wUsers = await usersCollection.find({ "uid": { $in: workspaceUsers } }).toArray();

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
                        return accept({
                            ...workspace,
                            ownerUser: {
                                username: user.username,
                                fullname: user.fullname ?? "",
                                avatar: user.avatar ?? ""
                            },
                            users: newWUsers
                        });
                    } else {
                        return reject("workspace-owner-user-doesnt-match");
                    }
                } else {
                    // check bearer

                    const decodedToken = await checkBearer(req.headers['authorization']);

                    if (!decodedToken) return reject("user-workspace-private");

                    const user = await usersCollection.findOne({ uid: decodedToken.user_id });
                    if (workspace.owner === user.uid || user?.role === "admin") {
                        try {
                            const workspaceUsers = workspace.users ?? [];
                            Log.debug("users: ", workspaceUsers);
                            const wUsers = await usersCollection.find({ "uid": { $in: workspaceUsers } }).toArray();

                            Log.debug("!!!wuser: ", wUsers);

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

                            return accept({
                                ...workspace,
                                ownerUser: {
                                    username: user.username,
                                    fullname: user.fullname ?? "",
                                    avatar: user.avatar ?? ""
                                },
                                users: newWUsers
                            })
                        } catch (error) {
                            return reject(error);
                        }
                    } else {
                        return reject();
                    }
                }
            } catch (error) {
                Log.error("error with workspace fetch: ", new Error(error).message);
                return reject("not-found")
            }
        },
        getworkspacedata: async () => {
            // get workspace data not including field and card data
            if (!id) return reject("invalid-params");

            try {

                const _findWorkspace = await workspacesCollection.findOne({ "id": id, _deleted: { $in: [null, false] } });
                if (!_findWorkspace) return reject("not-found");
                const _workspace = await checkWorkspaceOwner(_findWorkspace._id);
                if (!_workspace) return reject("not-found");

                const workspaceOwner = await usersCollection.findOne({ "uid": _workspace.owner });
                if (!workspaceOwner) return reject("owner-not-found");

                if (!_workspace.workspaceVisible) {
                    const decodedToken = await checkBearer(req.headers['authorization']);
                    if (decodedToken.user_id != _workspace.owner) {
                        return reject("not-found");
                    }
                }

                return accept({
                    title: _workspace?.title,
                    desc: _workspace?.desc,
                    thumbnail: _workspace?.thumbnail,
                    owner: {
                        username: workspaceOwner?.username,
                        fullname: workspaceOwner?.fullname ?? "",
                        avatar: workspaceOwner?.avatar ?? "",
                    },
                    id: _workspace?.id,
                    starred: _workspace?.starred,
                    updatedAt: _workspace?.updatedAt,
                    createdAt: _workspace?.createdAt,
                    workspaceVisible: _workspace?.workspaceVisible,
                });
            } catch (error) {
                return reject(error);
            }
        },
        removeworkspace: async () => {
            if (!uid || !id) return reject("invalid-params");
            try {
                const _workspace = await checkWorkspaceOwner(id);
                if (!_workspace) return reject();

                return await workspacesCollection.updateOne({ "_id": ObjectId(id) }, {
                    $set: {
                        _deleted: true,
                    }
                }).then(() => accept());
            } catch (error) {
                return reject(error);
            }
        },
        starworkspace: async () => {
            if (!uid || !id) return reject("invalid-params");

            try {
                const workspace = await workspacesCollection.findOne({ "_id": ObjectId(id), _deleted: { $in: [null, false] } });

                const decodedToken = await checkBearer(req.headers['authorization']);
                if (!decodedToken) return reject("no-auth");

                // check workspace
                if (!workspace) return reject("workspace-not-found");
                if (workspace.owner != decodedToken.user_id) return reject("no-auth");

                return await workspacesCollection.updateOne({ "_id": ObjectId(id) },
                    {
                        $set: {
                            starred: !workspace.starred,
                            updatedAt: Date.now(),
                        }
                    })
                    .then(() => accept());
            } catch (error) {
                return reject(error);
            }
        },
        editworkspace: async () => {
            if (!id || !uid) return reject("invalid-params");

            if (title?.length > 32) {
                return reject("title-maxlength");
            }
            if (desc?.length > 96) {
                return reject("desc-maxlength");
            }
            if (title?.length < 3) {
                return reject("title-minlength");
            }
            if (thumbnail?.type == "singleColor" && thumbnail?.color.length > 7) {
                return reject("invalid-color");
            } else if (thumbnail?.type == "gradient" && (thumbnail?.colors?.start?.length > 7 || thumbnail?.colors?.end?.length > 7)) {
                return reject("invalid-color");
            }

            try {
                const _workspace = await checkWorkspaceOwner(id);
                if (!_workspace) reject("workspace-not-found");

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
                        .then(() => accept());
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
                            .then(() => accept())
                            .catch(error => reject({ success: false, error }));
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
                            .then(() => accept())
                            .catch(error => reject({ success: false, error }));
                    }
                }
            } catch (error) {
                return reject({ success: false, error })
            }
        },
        addfield: async () => {
            if (!id || !uid || !sortBy) return reject("invalid-params");

            if (title.length > 28) return reject("title-maxlength");
            if (title.length < 2) return reject("title-minlength");

            try {

                const _workspace = await workspacesCollection.findOne({ "_id": ObjectId(id), _deleted: { $in: [null, false] } });
                const decodedToken = await checkBearer(req.headers['authorization']);
                if (!decodedToken) return reject("no-auth");

                // check workspace
                if (!_workspace) return reject("workspace-not-found");
                if (_workspace.owner != decodedToken.user_id) return reject("no-auth");

                Log.debug("workspace: ", _workspace);
                const _workspaceUsers = _workspace.users ?? [];

                Log.debug("workspaceUsers", _workspaceUsers);

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

                return accept()
            } catch (error) {
                res.status(400).send({ success: false, error: new Error(error).message });
            }
        },
        removefield: async () => {
            if (!id || !uid || !workspaceId) return reject("invalid-params");
            Log.debug("Workspace id: ", workspaceId, " id of field: ", id);

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
            if (!id || !uid || !workspaceId || (!title && !image.file)) return reject("invalid-params");
            if (color && color.length > 7) return reject("https://youtu.be/dQw4w9WgXcQ");
            if (title?.length > 40) return reject("https://youtu.be/HAK0fKEDPi4");
            if (desc?.length > 356) return reject("desc-maxlength");
            if (tags?.length > 10) return reject("tags-maxlength");

            if (tags && !Array.isArray(tags)) return reject("tags-invalid");

            const _workspace = await checkWorkspaceOwner(workspaceId);

            // check workspace
            if (!_workspace) return reject("workspace-not-found");

            let newTags = [];

            if (tags && tags.length > 0) {
                newTags = tags.map(el => {
                    return {
                        title: el.title,
                        color: el.color,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        _id: ObjectId(),
                    }
                });
            }

            // check new tags with for each
            if (tags && tags.length > 0) newTags.forEach(el => {
                if (el.title.length > 16) {
                    return reject("tag-title-maxlength");
                }
                if (el.color && el.color.length > 7) {
                    return reject("tag-color-maxlength");
                }
                if (el.color?.length > 1) {
                    if (el.color.charAt(0) != "#") {
                        return reject("tag-color-invalid");
                    }
                }
            });

            if (image?.file) {
                // card has an image, first add the card and then update its image to real one
                const cardId = ObjectId();

                const storageRef = admin.storage().bucket("gs://notal-1df19.appspot.com");
                const file = storageRef.file(`cardImages/temp/user_${uid}`);
                const fileExist = await file.exists();

                if (!fileExist[0]) return reject("no-image");

                await file.move(`cardImages/card_${cardId}`);
                const newFile = storageRef.file(`cardImages/card_${cardId}`);
                const url = await newFile.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                });

                return await workspacesCollection.findOneAndUpdate({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(id), _deleted: { $in: [null, false] } },
                    {
                        $push: {
                            "fields.$.cards": {
                                title,
                                desc,
                                color,
                                createdAt: Date.now(),
                                updatedAt: Date.now(),
                                tags: newTags,
                                owner: uid,
                                _id: ObjectId(cardId),
                                image: {
                                    file: url[0],
                                }
                            }
                        }
                    }).then(() => accept());
            } else {
                return await workspacesCollection.findOneAndUpdate({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(id), _deleted: { $in: [null, false] } },
                    {
                        $push: {
                            "fields.$.cards": {
                                title,
                                desc,
                                color,
                                createdAt: Date.now(),
                                updatedAt: Date.now(),
                                tags: newTags,
                                owner: uid,
                                _id: ObjectId(),
                            }
                        }
                    }
                ).then(() => accept());
            }
        },
        removecard: async () => {
            if (!id || !uid || !workspaceId || !fieldId) return reject("invalid-params");

            const _workspace = await checkWorkspaceOwner(workspaceId);
            if (!_workspace) return reject();

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
            if (field && field?.title?.length < 3) return reject("field-title-min");

            const _workspace = await checkWorkspaceOwner(workspaceId);
            if (!_workspace) return reject();

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
            if (!id || !uid || !workspaceId || !fieldId) return reject("invalid-params");

            Log.debug("editcard", id, uid, workspaceId, title, desc, color, fieldId);

            const _workspace = await checkWorkspaceOwner(workspaceId);
            if (!_workspace) return reject();

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
                            "fields.$[i].cards.$[j].tags": tags,
                            "fields.$[i].cards.$[j].updatedAt": Date.now(),
                        }
                    },
                    {
                        arrayFilters: [
                            { "i._id": ObjectId(fieldId) },
                            { "j._id": ObjectId(id) }
                        ]
                    }
                );
                return accept();
            } catch (error) {
                return reject(error);
            }
        },
        adduser: async () => {
            Log.debug("adduser", id, uid, username);

            if (!id || !uid || !username) return reject("invalid-params");

            const _workspace = await checkWorkspaceOwner(id);
            if (!_workspace) return reject();

            try {
                const user = await usersCollection.findOne({ "username": username });

                if (!user) return reject("user-not-found");

                const workspace = await workspacesCollection.findOne({ "_id": ObjectId(id) });

                if (workspace.users >= 20) return reject("workspace-max-users");
                if (!workspace) return reject("workspace-not-found");
                if (workspace?.owner == user.uid) return reject("owner-cant-be-added");
                if (workspace?.users.findIndex(el => el == user.uid) != -1) return reject("user-already-added");

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
            if (!id || !uid || !userId) return reject();

            const _workspace = await checkWorkspaceOwner(id);
            if (!_workspace) return reject();

            Log.debug("removeuser", id, uid);

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
        },
        reordercard: async () => {
            if (!id || !uid || !workspaceId || !destination || !source) return reject("invalid-params");

            const _workspace = await checkWorkspaceOwner(workspaceId);
            if (!_workspace) return reject();

            Log.debug("destination: ", destination, " source:", source, " workspaceId:", workspaceId, " cardId:", id);

            try {
                const _fieldIndex = _workspace.fields.findIndex(el => el._id == source.droppableId);
                const _field = _workspace.fields[_fieldIndex];
                const _cardIndex = _field.cards.findIndex(el => el._id == id);
                const _card = _field.cards[_cardIndex];

                // first remove card from field
                await workspacesCollection.updateOne({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(source.droppableId) }, {
                    $pull: {
                        "fields.$.cards": {
                            _id: ObjectId(id),
                        }
                    },
                    $set: {
                        "fields.$.updatedAt": Date.now(),
                    }
                });

                // then put it back to target field

                return await workspacesCollection.findOneAndUpdate({ "_id": ObjectId(workspaceId), "fields._id": ObjectId(destination.droppableId) },
                    {
                        $push: {
                            "fields.$.cards": {
                                $each: [_card],
                                $position: destination.index,
                            }
                        }
                    }).then(() => accept());

            } catch (error) {
                return reject(error);
            }
        }
    }

    const WPAction = workspaceAction[WORKSPACE_ACTION?.toLowerCase()]

    if (!WPAction) {
        return reject();
    } else {
        return await WPAction();
    }
}
