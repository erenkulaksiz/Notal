import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import Pusher from "@lib/pusherServer";
import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import type { ValidateUserReturnType } from "@utils/api/validateUser";

export async function deletefield(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.id) return reject({ res });
  const { id } = body;

  // get workspaceId to remove from
  if (!body.workspaceId) return reject({ res });
  const { workspaceId } = body;

  // check if workspaceId is valid ObjectId
  if (!ObjectId.isValid(workspaceId)) return reject({ res });

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(workspaceId),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  const isOwner = workspace.owner == validateUser.decodedToken.user_id;
  const isUser = workspace.users.includes(validateUser.decodedToken.user_id);
  if (!isOwner && !isUser) return reject({ reason: "no-permission", res });

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(workspaceId) },
      {
        $pull: {
          fields: {
            _id: new ObjectId(id),
          },
        },
        $set: {
          updatedAt: Date.now(),
        },
      }
    )
    .then(async () => {
      await Pusher?.trigger(
        `notal-workspace-${workspaceId}`,
        "workspace-updated",
        {
          workspaceId,
          sender: validateUser.decodedToken.user_id,
          sendTime: Date.now(),
          change: "field_delete",
        }
      );
      accept({
        res,
        action: "deletefield",
      });
    })
    .catch((error) => reject({ reason: error, res }));
}
