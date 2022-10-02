import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";

export async function togglevisibility(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  // get id of workspace
  if (!body.id) return reject({ res });
  const { id } = body;
  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          workspaceVisible: !workspace.workspaceVisible,
          updatedAt: Date.now(),
        },
      }
    )
    .then(() =>
      accept({
        res,
        action: "toggleVisibility",
      })
    )
    .catch((error) => reject({ reason: error, res }));
}
