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
  const { uid } = body;

  const workspaces = await workspacesCollection
    .find({
      owner: uid,
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
