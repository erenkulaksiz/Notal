import { connectToDatabase } from "@lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");

export async function getworkspaces(req: NextApiRequest, res: NextApiResponse) {
  let token = "";
  const { db } = await connectToDatabase();
  const usersCollection = await db.collection("users");
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.uid) return reject({ reason: "no-uid", res });

  const bearer = req.headers["authorization"];
  const bearerToken = bearer?.split(" ")[1];
  if (typeof bearerToken == "undefined")
    return reject({ reason: "invalid-params", res });

  const validateUser = await ValidateUser({ token: bearerToken });

  if (!validateUser && !validateUser.decodedToken.success)
    return reject("invalid-token");

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
  });
}
