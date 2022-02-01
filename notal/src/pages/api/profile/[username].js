const { connectToDatabase } = require('../../../../lib/mongodb');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ success: false });
        return;
    }
    const { username } = req.query;

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");
    console.log("search for username:", username);
    const user = await usersCollection.findOne({ username });
    console.log("user: ", user);
    if (user) {
        res.status(200).send({ success: true, data: user });
    } else {
        res.status(400).send({ success: false, error: "cant-find-user" });
    }
}
