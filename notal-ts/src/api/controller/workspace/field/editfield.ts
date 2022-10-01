import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { ValidateUser } from "@utils/api/validateUser";
import { accept, reject } from "@api/utils";

import { Log } from "@utils";

export async function editfield(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.uid) return reject({ reason: "no-uid", res });

  // get field id to edit
  if (!body.id) return reject({ reason: "no-id", res });

  const { id } = body;

  // get workspaceId to edit field from
  if (!body.workspaceId) return reject({ res });
  const { workspaceId } = body;

  const bearer = getTokenFromHeader(req);

  const validateUser = await ValidateUser({ token: bearer });

  if (validateUser && !validateUser.decodedToken)
    return reject({ reason: validateUser.decodedToken.errorCode, res });

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
