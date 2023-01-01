import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import Pusher from "@lib/pusherServer";
import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import type { FieldTypes } from "@types";
import type { ValidateUserReturnType } from "@utils/api/validateUser";

export async function reorderfield(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  // get workspace id
  const { body } = req;
  if (!body.id) return reject({ reason: "no-id", res });

  const { id } = body;

  if (!ObjectId.isValid(id)) return reject({ res });

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  const isOwner = workspace.owner == validateUser.decodedToken.user_id;
  const isUser = workspace.users.includes(validateUser.decodedToken.user_id);
  if (!isOwner && !isUser) return reject({ reason: "no-permission", res });

  // get destination and source
  if (!body.destination || !body.source)
    return reject({ reason: "no-destination-or-source", res });
  const { destination, source } = body;

  // get field id
  if (!body.fieldId) return reject({ reason: "no-field-id", res });
  const { fieldId } = body;

  const fieldIndex = workspace.fields.findIndex(
    (field: FieldTypes) => field._id == fieldId
  );
  const field = workspace.fields[fieldIndex];

  // first remove field
  await workspacesCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $pull: {
        fields: {
          _id: new ObjectId(fieldId),
        },
      },
      $set: {
        updatedAt: Date.now(),
      },
    }
  );

  // then add field to destination
  return await workspacesCollection
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        // @ts-ignore
        $push: {
          fields: {
            $each: [field],
            $position: destination.index,
          },
        },
        $set: {
          updatedAt: Date.now(),
        },
      }
    )
    .then(async () => {
      await Pusher?.trigger(`notal-workspace-${id}`, "workspace-updated", {
        workspaceId: id,
        sender: validateUser.decodedToken.user_id,
        sendTime: Date.now(),
        change: "field_reorder",
      });
      accept({
        res,
        action: "reorderfield",
      });
    })
    .catch((error) => reject({ reason: error, res }));
}
