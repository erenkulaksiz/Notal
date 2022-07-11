import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils";
import { WorkspaceTypes } from "@types";

export const WorkspaceService = {
  workspace: {
    create: async function ({
      title,
      desc,
      starred,
      workspaceVisible,
      thumbnail,
    }: WorkspaceTypes) {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const data = await workspaceFetch(
        {
          title,
          desc,
          starred,
          workspaceVisible,
          thumbnail,
          owner: auth?.currentUser?.uid,
        },
        {
          token,
          action: "create",
        }
      );

      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: data?.error };
    },
    star: async function (id: string) {
      // Send a star workspace request to API.
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const data = await workspaceFetch(
        {
          id,
          uid: auth?.currentUser?.uid,
        },
        {
          token,
          action: "star",
        }
      );

      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: data?.error };
    },
    delete: async function (id: string) {
      // Send a delete workspace request to API.
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const data = await workspaceFetch(
        {
          id,
          uid: auth?.currentUser?.uid,
        },
        {
          token,
          action: "delete",
        }
      );

      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: data?.error };
    },
  },
};
