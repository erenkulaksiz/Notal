import { connectToDatabase } from "@lib/mongodb";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { Log } from "@utils/logger";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");

export async function getworkspace(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.id) return reject({ reason: "no-id", res });
  const { id } = body;

  const workspace = await workspacesCollection.findOne({
    id,
    _deleted: { $in: [null, false] },
  });

  if (workspace?.workspaceVisible == false) {
    if (!body.uid) return reject({ reason: "no-uid", res });
    const bearer = getTokenFromHeader(req);
    const validateUser = await ValidateUser({ token: bearer });
    if (!validateUser || !validateUser?.decodedToken?.success)
      return reject({
        reason: validateUser?.decodedToken?.errorCode ?? "no-token",
        res,
      });
    if (workspace.owner != validateUser.decodedToken.uid) {
      return reject({
        reason: "not-found",
        res,
      });
    }
  }

  return accept({
    data: workspace,
    res,
    action: "getworkspaces",
  });
}
