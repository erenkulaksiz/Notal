import { ValidateUser } from "@utils/api/validateUser";
import { connectToDatabase } from "@lib/mongodb";
import { WorkspaceTypes } from "@types";
import { Log } from "..";

export interface WorkspaceDataReturnType {
  success?: boolean;
  error?:
    | string
    | {
        errorCode: string;
      };
  data?: WorkspaceTypes;
}

export async function GetWorkspaceData({
  id,
  token,
}: {
  id?: string;
  token?: string;
}): Promise<WorkspaceDataReturnType> {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");
  const usersCollection = await db.collection("users");

  if (!id) return { error: "no-id", success: false };

  const findWorkspace = await workspacesCollection.findOne({
    id,
    _deleted: { $in: [null, false] },
  });
  if (!findWorkspace) return { success: false, error: "not-found" };
  const findWorkspaceOwner = await usersCollection.findOne({
    uid: findWorkspace.owner,
  });
  if (!findWorkspaceOwner) return { success: false, error: "owner-not-found" };

  if (findWorkspace.workspaceVisible === false) {
    if (!token) return { error: "no-token", success: false };

    const validateUser = await ValidateUser({ token });

    if (validateUser && !validateUser.decodedToken) {
      return {
        success: false,
        error: validateUser?.errorCode,
      };
    }

    const isOwner =
      findWorkspace?.users?.findIndex(
        (uid: string) => uid == validateUser.decodedToken.uid
      ) == -1
        ? false
        : true;

    if (!isOwner) {
      return {
        success: false,
        error: "not-found",
      };
    }
  }

  return {
    success: true,
    data: {
      title: findWorkspace.title,
      desc: findWorkspace.desc ?? null,
      thumbnail: findWorkspace.thumbnail,
      owner: {
        username: findWorkspaceOwner.username,
        fullname: findWorkspaceOwner.fullname,
        avatar: findWorkspaceOwner.avatar,
        uid: findWorkspaceOwner.uid,
      },
      id: findWorkspace.id,
      _id: findWorkspace._id.toString(),
      starred: findWorkspace.starred,
      updatedAt: findWorkspace.updatedAt,
      createdAt: findWorkspace.createdAt,
      workspaceVisible: findWorkspace.workspaceVisible,
      users: findWorkspace.users ?? [findWorkspace.owner],
    },
  };
}
