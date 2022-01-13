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

    const { uid, title, desc, action, starred, id, workspaceId, color, fieldId } = JSON.parse(req.body);

    const workspaceAction = {
        create: async () => {
            if (!uid || !action) {
                res.status(400).send({ success: false, error: "invalid-params" })
                return;
            }

            const ref = await admin.database().ref(`/workspaces`).push();
            await ref.set({
                title, desc, starred, createdAt: Date.now(), updatedAt: Date.now(), owner: uid
            });
            res.status(200).send({ success: true });
        },
        get_workspaces: async () => {
            const { uid } = JSON.parse(req.body);

            if (!uid) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            await admin.database().ref(`/workspaces`).orderByChild("owner").equalTo(uid).once("value", async (snapshot) => {
                if (snapshot.exists()) {
                    res.status(200).send({ success: true, data: snapshot.val() });
                } else {
                    res.status(200).send({ success: true });
                }
            });
        },
        get_workspace: async () => {
            if (!id) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            await admin.database().ref(`/workspaces/${id}`).once("value", async (snapshot) => {
                if (snapshot.exists()) {
                    const workspace = snapshot.val();

                    await admin.database().ref(`/users/${workspace.owner}`).once("value", async (snapshot) => {
                        if (snapshot.exists()) {
                            res.status(200).send({ success: true, data: { ...workspace, profile: snapshot.val() } });
                        } else {
                            res.status(400).send({ success: false });
                        }
                    }).catch(error => {
                        res.status(400).send({ success: false, error });
                    });
                } else {
                    res.status(400).send({ success: false });
                }
            }).catch(error => {
                res.status(400).send({ success: false, error });
            });
        },
        delete: async () => {
            if (!uid) {
                res.status(400).send({ success: false, error: "invalid-params" });
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
        },
        star: async () => {
            if (!uid || !id) {
                res.status(400).send({ success: false, error: "invalid-params" });
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
        },
        edit: async () => {
            if (!id || !uid) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            await admin.database().ref(`/workspaces/${id}`).once("value", async (snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.val().owner == uid) {

                        await admin.database().ref(`/workspaces/${id}`).update({ title, desc, updatedAt: Date.now() }, () => {
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
        },
        addfield: async () => {
            if (!id || !uid) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            const ref = await admin.database().ref(`/workspaces/${id}/fields`).push();
            await ref.set({
                title, createdAt: Date.now(), updatedAt: Date.now(),
            }, () => {
                res.status(200).send({ success: true });
            }).catch((error) => {
                res.status(400).send({ success: false, error });
            });
        },
        removefield: async () => {
            if (!id || !uid || !workspaceId) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            console.log("Workspace id: ", workspaceId, " id of field: ", id);

            await admin.database().ref(`/workspaces/${workspaceId}/fields/${id}`).remove(() => {
                res.status(200).send({ success: true });
            }).catch((error) => {
                res.status(400).send({ success: false, error });
            });
        },
        addcard: async () => {

            // id: field id

            console.log(color, title, desc, workspaceId, uid, id);
            if (!id || !uid || !workspaceId || !title || !desc || !color) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            const ref = await admin.database().ref(`/workspaces/${workspaceId}/fields/${id}/cards`).push();

            await ref.set({
                title, createdAt: Date.now(), updatedAt: Date.now(), title, desc, color
            }, () => {
                res.status(200).send({ success: true });
            }).catch((error) => {
                res.status(400).send({ success: false, error });
            });
        },
        removecard: async () => {
            if (!id || !uid || !workspaceId || !fieldId) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            await admin.database().ref(`/workspaces/${workspaceId}/fields/${fieldId}/cards/${id}`).remove(() => {
                res.status(200).send({ success: true });
            }).catch((error) => {
                res.status(400).send({ success: false, error });
            });
        },
        editfield: async () => {
            if (!id || !uid || !workspaceId || !title) {
                res.status(400).send({ success: false, error: "invalid-params" });
                return;
            }

            await admin.database().ref(`/workspaces/${workspaceId}/fields/${id}`).update({ title, updatedAt: Date.now() }, () => {
                res.status(200).send({ success: true });
            }).catch(error => {
                res.status(400).send({ success: false, error });
            });
        }
    }

    if (!workspaceAction[action.toLowerCase()]) {
        res.status(400).send({ success: false });
    } else {
        await workspaceAction[action.toLowerCase()]();
    }
}
