import { connectToDatabase } from "@lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

import { Log } from "@utils";
import { WorkspaceTypes } from "@types";

const { accept, reject } = require("@api/utils");

interface WorkspaceWithUsers extends WorkspaceTypes {
  users: Array<{
    username: string;
    avatar: string;
    fullname?: string | null;
    uid: string;
  }>;
}

export async function getworkspaces(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");
  const usersCollection = await db.collection("users");

  const { body } = req;
  const { uid } = body;

  const workspaces = await workspacesCollection
    .find({
      users: { $in: [uid] },
      _deleted: { $in: [null, false] },
    })
    .toArray();

  // @ts-ignore-next-line
  const workspacesWithUsers: Array<WorkspaceWithUsers> = await Promise.all(
    workspaces.map(async (el) => {
      const workspaceUsers = await Promise.all(
        el.users.map(async (user: any) => {
          const findUser = await usersCollection.findOne({
            uid: user,
          });
          if (!findUser) {
            Log.error("User not found in database, workspace users");
            return reject({ res, reason: "no-user" });
          }
          return {
            username: findUser.username,
            avatar: findUser.avatar,
            fullname: findUser.fullname ?? null,
            uid: findUser.uid,
          };
        })
      );
      return {
        ...el,
        users: workspaceUsers,
      };
    })
  );

  return accept({
    data: workspacesWithUsers.map((workspace: WorkspaceWithUsers) => {
      return {
        _id: workspace._id,
        id: workspace?.id,
        createdAt: workspace.createdAt,
        desc: workspace.desc,
        title: workspace.title,
        owner: workspace.owner,
        starred: workspace.starred,
        updatedAt: workspace.updatedAt,
        workspaceVisible: workspace.workspaceVisible,
        thumbnail: workspace.thumbnail,
        users: workspace?.users ?? [workspace.owner],
      };
    }),
    res,
    action: "getworkspaces",
  });
}
