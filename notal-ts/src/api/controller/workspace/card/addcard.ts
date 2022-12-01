import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import { CardTypes, FieldTypes } from "@types";
import { LIMITS } from "@constants/limits";
import { Log } from "@utils/index";

export async function addcard(req: NextApiRequest, res: NextApiResponse) {
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
    card?.title?.length > LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
  )
    return reject({ reason: "max-title-length", res });
  if (
    card.title &&
    card?.title?.length < LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
  )
    return reject({ reason: "min-title-length", res });

  if (
    card.desc &&
    card.desc.length > LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH
  )
    return reject({ reason: "max-desc-length", res });

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(workspaceId),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

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
            title: card.title,
            desc: card.desc,
            color: card.color,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            owner: uid,
            cards: [],
            _id: new ObjectId(),
          },
        },
      }
    )
    .then(() =>
      accept({
        res,
        action: "addcard",
      })
    )
    .catch((error) => reject({ reason: error, res }));
}
