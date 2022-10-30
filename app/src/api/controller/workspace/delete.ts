import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";

export async function deleteworkspace(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.id) return reject({ res });
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
