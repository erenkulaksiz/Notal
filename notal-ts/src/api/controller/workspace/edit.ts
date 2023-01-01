import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import Pusher from "@lib/pusherServer";
import { LIMITS } from "@constants/limits";
import type { ValidateUserReturnType } from "@utils/api/validateUser";

export async function editworkspace(
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

  if (!body.title) return reject({ reason: "no-title", res });
  const { title } = body;
  if (title.length > LIMITS.MAX.WORKSPACE_TITLE_CHARACTER_LENGTH)
    return reject({ reason: "title-maxlength", res });

  const { desc } = body;
  if (desc.length > LIMITS.MAX.WORKSPACE_DESC_CHARACTER_LENGTH)
    return reject({ reason: "desc-maxlength", res });

  const { starred, workspaceVisible } = body;

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
          title,
          desc,
          starred,
          workspaceVisible,
          updatedAt: Date.now(),
        },
      }
    )
    .then(async () => {
      await Pusher?.trigger(`notal-workspace-${id}`, "workspace-updated", {
        workspaceId: id,
        sender: validateUser.decodedToken.user_id,
        sendTime: Date.now(),
        change: "workspace_edit",
      });
      accept({ res, action: "deleteWorkspace" });
    });
}
