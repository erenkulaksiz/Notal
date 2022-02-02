const { connectToDatabase } = require('../../../../lib/mongodb');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ success: false });
        return;
    }
    const { username } = req.query;

    let auth = {};

    if (JSON.parse(req.body).auth) {
        auth = JSON.parse(req.body).auth;
    }

    console.log("auth: ", auth);

    const { db } = await connectToDatabase();
    console.log("search for username:", username);
    try {
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ username });
        if (user) {

            let workspaces = [];
            if (user.profileVisible) {
                const workspacesCollection = db.collection("workspaces");
                workspaces = await workspacesCollection.find({ owner: user.uid }).toArray();
            } else {
                if (auth) {
                    if (user._id == auth._id) {
                        const workspacesCollection = db.collection("workspaces");
                        workspaces = await workspacesCollection.find({ owner: user.uid }).toArray();
                    } else {
                        workspaces = "user-profile-private";
                    }
                } else {
                    workspaces = "user-profile-private";
                }
            }

            res.status(200).send({ success: true, data: { ...user, workspaces } });
        } else {
            res.status(400).send({ success: false, error: "cant-find-user" });
        }
    } catch (error) {
        res.status(200).send({ success: false, error: new Error(error).message });
    }
}
