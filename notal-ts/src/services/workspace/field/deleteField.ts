import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";

/**
 * remove field from workspace
 * @param title string
 * @param id string
 */
export async function deleteField({
  workspaceId,
  id,
}: {
  id: string;
  workspaceId: string;
}): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      workspaceId,
      uid: auth?.currentUser?.uid,
      id,
    },
    {
      token,
      action: "field/delete",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
