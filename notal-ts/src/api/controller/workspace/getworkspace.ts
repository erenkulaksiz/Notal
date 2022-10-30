import { connectToDatabase } from "@lib/mongodb";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { NextApiRequest, NextApiResponse } from "next";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");

export async function getworkspace(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");
  const usersCollection = await db.collection("users");

  const { body } = req;
  if (!body.id) return reject({ reason: "no-id", res });
  const { id } = body;

  let workspace = await workspacesCollection.findOne({
    id,
    _deleted: { $in: [null, false] },
  });

  if (!workspace) {
    return reject({ reason: "not-found", res });
  }

  if (workspace?.workspaceVisible == false) {
    if (!body.uid) return reject({ reason: "no-uid", res });
    const bearer = getTokenFromHeader(req);
    const validateUser = await ValidateUser({ token: bearer });
    if (!validateUser || !validateUser?.decodedToken)
      return reject({
        reason: validateUser?.decodedToken?.errorCode ?? "no-token",
        res,
      });
    if (workspace.owner != validateUser.decodedToken.uid) {
      return reject({
        reason: "user-workspace-private",
        res,
      });
    }
  }

  if (!workspace?.owner) {
    return reject({ res, reason: "no-owner" });
  }
  const workspaceOwner = await usersCollection.findOne({
    uid: workspace.owner,
  });
  if (!workspaceOwner) {
    return reject({ res, reason: "no-owner" });
  }
  workspace = {
    ...workspace,
    owner: {
      username: workspaceOwner.username,
      uid: workspaceOwner?.uid,
      avatar: workspaceOwner?.avatar,
      fullname: workspaceOwner?.fullname,
    },
  };

  return accept({
    data: workspace,
    res,
    action: "getworkspaces",
  });
}
