import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import type { CardTypes, FieldTypes } from "@types";

export async function reordercard(req: NextApiRequest, res: NextApiResponse) {
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

  // get from field
  const fieldIndex = workspace.fields.findIndex(
    (field: FieldTypes) => field._id == source.droppableId
  );
  const field = workspace.fields[fieldIndex];
  const cardIndex = field.cards.findIndex(
    (card: CardTypes) => card._id == cardId
  );
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
    .then(() =>
      accept({
        res,
        action: "reordercard",
      })
    )
    .catch((error) => reject({ reason: error, res }));
}
