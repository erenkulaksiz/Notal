import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
const { accept, reject } = require("@api/utils");

export async function deleteWorkspace(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.uid || !body.id) return reject("invalid-params");
  const { id } = body;

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          _deleted: true,
        },
      }
    )
    .then(() => accept({ res, action: "deleteWorkspace" }));
}
