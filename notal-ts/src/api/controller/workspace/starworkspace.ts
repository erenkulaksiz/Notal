import { connectToDatabase } from "@lib/mongodb";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");

export async function starworkspace(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.uid) return reject({ reason: "no-uid", res });
  // we have uid of user request in body.uid now

  // get id of workspace
  if (!body.id) return reject({ res });

  const { id } = body;

  const bearer = getTokenFromHeader(req);

  const validateUser = await ValidateUser({ token: bearer });

  if (validateUser && !validateUser.decodedToken.success)
    return reject({ reason: validateUser.decodedToken.errorCode, res });

  const workspace = await workspacesCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!workspace) return reject({ reason: "no-workspace", res });

  return await workspacesCollection
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          starred: !workspace.starred,
          updatedAt: Date.now(),
        },
      }
    )
    .then(() =>
      accept({
        res,
        action: "starworkspace",
      })
    )
    .catch((error) => reject({ reason: error, res }));
}
