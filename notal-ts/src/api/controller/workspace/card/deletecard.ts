import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";

export async function deletecard(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.id) return reject({ res });
  const { id } = body;
  if (!body.fieldId) return reject({ res });
  const { fieldId } = body;
  if (!body.workspaceId) return reject({ res });
  // get workspaceId to remove from
  if (!body.workspaceId) return reject({ res });
  const { workspaceId } = body;

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(workspaceId),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(workspaceId), "fields._id": new ObjectId(fieldId) },
      {
        $pull: {
          "fields.$.cards": {
            _id: new ObjectId(id),
          },
        },
        $set: {
          "fields.$.updatedAt": Date.now(),
        },
      }
    )
    .then(() =>
      accept({
        res,
        action: "deletecard",
      })
    )
    .catch((error) => reject({ reason: error, res }));
}
