import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import Pusher from "@lib/pusherServer";
import type { ValidateUserReturnType } from "@utils/api/validateUser";

export async function deleteworkspace(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.id) return reject({ res });
  const { id } = body;

  if (!ObjectId.isValid(id)) return reject({ res });

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!workspace) return reject({ reason: "no-workspace", res });

  const isOwner = workspace.owner == validateUser.decodedToken.user_id;
  if (!isOwner) return reject({ reason: "no-permission", res });

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          _deleted: true,
        },
      }
    )
    .then(async () => {
      await Pusher?.trigger(`notal-workspace-${id}`, "workspace-updated", {
        workspaceId: id,
        sender: validateUser.decodedToken.user_id,
        sendTime: Date.now(),
        change: "workspace_delete",
      });
      accept({ res, action: "deleteWorkspace" });
    });
}
