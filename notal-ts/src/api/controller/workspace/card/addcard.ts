import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import Pusher from "@lib/pusherServer";
import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import { CardTypes, FieldTypes } from "@types";
import { LIMITS } from "@constants/limits";
import { Log } from "@utils/index";
import type { ValidateUserReturnType } from "@utils/api/validateUser";

export async function addcard(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  const { uid } = body;

  // get field id
  if (!body.id) return reject({ reason: "no-id", res });
  const { id } = body;

  // get worskpace id
  if (!body.workspaceId) return reject({ res });
  const { workspaceId } = body;

  // get card data
  if (!body.card) return reject({ res });
  const { card }: { card: CardTypes } = body;

  if (
    card.color &&
    card.color.length > LIMITS.MAX.WORKSPACE_CARD_COLOR_CHARACTER_LENGTH
  )
    return reject({ reason: "max-color-length", res });

  if (!card.title && !card.desc) return reject({ res, reason: "no-card-data" });

  if (
    card.title &&
    card?.title?.trim().length >
      LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
  )
    return reject({ reason: "max-title-length", res });
  if (
    card.title &&
    card?.title?.trim().length <
      LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
  )
    return reject({ reason: "min-title-length", res });

  if (
    card.desc &&
    card.desc?.trim().length > LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH
  )
    return reject({ reason: "max-desc-length", res });

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(workspaceId),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  const isOwner = workspace.owner == validateUser.decodedToken.user_id;
  const isUser = workspace.users.includes(validateUser.decodedToken.user_id);
  if (!isOwner && !isUser) return reject({ reason: "no-permission", res });

  Log.debug("fields:", workspace.fields);
  // find field
  const fieldIndex = workspace.fields.findIndex(
    (field: FieldTypes) => field._id?.toString() === id
  );
  const field = workspace.fields[fieldIndex];
  if (field.cards && field.cards.length >= LIMITS.MAX.WORKSPACE_CARD_LENGTH)
    return reject({ reason: "max-cards", res });

  return await workspacesCollection
    .findOneAndUpdate(
      {
        _id: new ObjectId(workspaceId),
        "fields._id": new ObjectId(id),
        _deleted: { $in: [null, false] },
      },
      {
        // @ts-ignore
        $push: {
          "fields.$.cards": {
            title: card.title?.trim(),
            desc: card.desc?.trim(),
            color: card.color,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            owner: uid,
            cards: [],
            _id: new ObjectId(),
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
          change: "card_add",
        }
      );
      accept({
        res,
        action: "addcard",
      });
    })
    .catch((error) => reject({ reason: error, res }));
}
