import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";

export async function editfield(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.id) return reject({ reason: "no-id", res });

  const { id } = body;

  // get workspaceId to edit field from
  if (!body.workspaceId) return reject({ res });
  const { workspaceId } = body;

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(workspaceId),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  // get title to edit
  if (!body.title) return reject({ reason: "no-title", res });
  const { title } = body;

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(workspaceId), "fields._id": new ObjectId(id) },
      {
        $set: {
          "fields.$.title": title,
          "fields.$.updatedAt": Date.now(),
        },
      }
    )
    .then(() =>
      accept({
        res,
        action: "editfield",
      })
    )
    .catch((error) => reject({ reason: error, res }));
}
