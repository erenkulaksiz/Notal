import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";
import type { WorkspaceTypes } from "@types";

export async function addWorkspace({
  title,
  desc,
  starred,
  workspaceVisible,
  thumbnail,
}: WorkspaceTypes): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      title,
      desc,
      starred,
      workspaceVisible,
      thumbnail: {
        ...thumbnail,
        type: thumbnail.type,
        fileData: null,
      },
      owner: auth?.currentUser?.uid,
      uid: auth?.currentUser?.uid,
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
}
