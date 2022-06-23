import { connectToDatabase } from "@lib/mongodb";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { Log } from "@utils/logger";
import { NextApiRequest, NextApiResponse } from "next";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");

export async function getworkspaces(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.uid) return reject({ reason: "no-uid", res });
  // we have uid of user request in body.uid now

  const bearer = getTokenFromHeader(req);

  const validateUser = await ValidateUser({ token: bearer });

  if (validateUser && !validateUser.decodedToken.success)
    return reject({ reason: validateUser.decodedToken.errorCode, res });

  const workspaces = await workspacesCollection
    .find({
      owner: validateUser.decodedToken.user_id,
      _deleted: { $in: [null, false] },
    })
    .toArray();

  return accept({
    data: workspaces.map((el) => {
      return {
        _id: el._id,
        id: el?.id,
        createdAt: el.createdAt,
        desc: el.desc,
        title: el.title,
        owner: el.owner,
        starred: el.starred,
        updatedAt: el.updatedAt,
        workspaceVisible: el.workspaceVisible,
        thumbnail: el.thumbnail,
      };
    }),
    res,
    action: "getworkspaces",
  });
}
