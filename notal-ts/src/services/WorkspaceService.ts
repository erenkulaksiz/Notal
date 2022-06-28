import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils";

export const WorkspaceService = {
  workspace: {
    star: async function (id: string) {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const data = await workspaceFetch(
        {
          id,
          uid: auth?.currentUser?.uid,
        },
        {
          token,
          action: "starworkspace",
        }
      );

      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: data?.error };
    },
  },
};
