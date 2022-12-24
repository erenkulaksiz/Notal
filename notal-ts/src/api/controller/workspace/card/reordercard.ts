import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import Pusher from "@lib/pusherServer";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import { LIMITS } from "@constants/limits";
import type { CardTypes, FieldTypes } from "@types";
import type { ValidateUserReturnType } from "@utils/api/validateUser";
import { Log } from "@utils/logger";

export async function reordercard(
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

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  // get destination and source
  if (!body.destination || !body.source)
    return reject({ reason: "no-destination-or-source", res });
  const { destination, source } = body;

  if (!body.cardId) return reject({ reason: "no-card-id", res });
  const { cardId } = body;

  const sourceField = workspace.fields.find(
    (field: FieldTypes) => field._id == source.droppableId
  );
  const destinationField = workspace.fields.find(
    (field: FieldTypes) => field._id == destination.droppableId
  );

  // check cards in source and destination
  if (!sourceField) return reject({ reason: "no-source-field", res });
  if (!destinationField) return reject({ reason: "no-destination-field", res });

  if (sourceField._id != destinationField._id) {
    // if not same field
    if (destinationField?.cards.length >= LIMITS.MAX.WORKSPACE_CARD_LENGTH)
      return reject({ reason: "max-cards-length", res });
  }

  // get from field
  const fieldIndex = workspace.fields.findIndex(
    (field: FieldTypes) => field._id == source.droppableId
  );
  const field = workspace.fields[fieldIndex];
  const cardIndex = field.cards.findIndex((card: CardTypes) => {
    return card?._id == cardId;
  });
  const card = field.cards[cardIndex];

  // first remove card from field
  await workspacesCollection.updateOne(
    { _id: new ObjectId(id), "fields._id": new ObjectId(source.droppableId) },
    {
      $pull: {
        "fields.$.cards": {
          _id: new ObjectId(cardId),
        },
      },
      $set: {
        "fields.$.updatedAt": Date.now(),
      },
    }
  );

  // then add card to destination
  return await workspacesCollection
    .findOneAndUpdate(
      {
        _id: new ObjectId(id),
        "fields._id": new ObjectId(destination.droppableId),
      },
      {
        // @ts-ignore
        $push: {
          "fields.$.cards": {
            $each: [card],
            $position: destination.index,
          },
        },
      }
    )
    .then(async () => {
      await Pusher?.trigger(`notal-workspace-${id}`, "workspace-updated", {
        workspaceId: id,
        sender: validateUser.decodedToken.user_id,
        sendTime: Date.now(),
        change: "card_reorder",
      });
      accept({
        res,
        action: "reordercard",
      });
    })
    .catch((error) => reject({ reason: error, res }));
}
