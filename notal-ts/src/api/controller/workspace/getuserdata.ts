import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";

export async function getuserdata(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const usersCollection = await db.collection("users");

  const { body } = req;
  if (!body.username) return reject({ res });
  const { username } = body;

  const user = await usersCollection.findOne({
    username,
  });

  if (!user) return reject({ reason: "no-user-found", res });

  return accept({
    data: {
      avatar: user.avatar,
      fullname: user.fullname ?? "",
      username: user.username,
      uid: user.uid,
    },
    res,
    action: "getuserdata",
  });
}
