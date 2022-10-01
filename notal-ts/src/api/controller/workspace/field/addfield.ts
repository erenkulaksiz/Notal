import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { ValidateUser } from "@utils/api/validateUser";
import { accept, reject } from "@api/utils";
import { LIMITS } from "@constants/limits";

export async function addfield(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.uid) return reject({ reason: "no-uid", res });
  // we have uid of user request in body.uid now
  const { uid } = body;

  // get worskpace id
  if (!body.id) return reject({ res });

  const { id } = body;

  // get title of field to add
  if (!body.title) return reject({ res });
  const { title } = body;

  const bearer = getTokenFromHeader(req);

  const validateUser = await ValidateUser({ token: bearer });

  if (validateUser && !validateUser.decodedToken)
    return reject({ reason: validateUser.decodedToken.errorCode, res });

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  if (
    workspace.fields &&
    workspace.fields.length > LIMITS.MAX.WORKSPACE_FIELD_LENGTH
  )
    return reject({ reason: "max-fields-length", res });

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          fields: {
            title,
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
        action: "addfield",
      })
    )
    .catch((error) => reject({ reason: error, res }));
}
