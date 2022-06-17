const { connectToDatabase } = require('../../../lib/mongodb');
const { db } = await connectToDatabase();
const usersCollection = db.collection("users");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ success: false });
        return;
    }
    const data = JSON.parse(req.body);
    if ((!data?.uid || !data?.username) && data?.type != "avatar") {
        res.status(400).send({ success: false });
        return;
    }
    if ((data.username?.length > 28) && data?.type != "avatar") {
        res.status(400).json({ success: false, error: "auth/username-too-long" });
        return;
    } else if ((data.username?.length < 3) && data?.type != "avatar") {
        res.status(400).json({ success: false, error: "auth/username-too-short" });
        return;
    }

    if (data?.type == "avatar") {
        if (!data.avatar) {
            res.status(400).send({ success: false });
            return;
        }
        await usersCollection.updateOne({ uid: data.uid }, {
            $set: {
                avatar: data.avatar ?? "",
            }
        })
        res.status(200).send({ success: true });
    } else {
        const currUser = await usersCollection.findOne({ uid: data.uid });
        if (currUser.username != data.username) {
            const userWithUsername = await usersCollection.findOne({ username: data.username });
            if (!userWithUsername) {
                await usersCollection.updateOne({ uid: data.uid }, {
                    $set: {
                        fullname: data.fullname ?? "",
                        bio: data.bio ?? "",
                        updatedAt: Date.now(),
                        profileVisible: data.profileVisible ?? false,
                        username: data?.username,
                        /*links: {
                            website: data.links.website ?? "",
                            instagram: data.links.instagram ?? "",
                            twitter: data.links.twitter ?? "",
                            github: data.links.github ?? "",
                        }*/
                    }
                })
                res.status(200).send({ success: true });
            } else {
                res.status(400).send({ success: false, error: "auth/username-already-in-use" });
            }
        } else {
            await usersCollection.updateOne({ uid: data.uid }, {
                $set: {
                    fullname: data.fullname ?? "",
                    bio: data.bio ?? "",
                    updatedAt: Date.now(),
                    profileVisible: data.profileVisible ?? false,
                    links: {
                        website: data.links?.website ?? "",
                        instagram: data.links?.instagram ?? "",
                        twitter: data.links?.twitter ?? "",
                        github: data.links?.github ?? "",
                    }
                }
            });
            res.status(200).send({ success: true });
        }
    }
}