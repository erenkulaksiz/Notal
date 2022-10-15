import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";

/**
 * remove card from field in workspace
 * @param id string
 */
export async function deleteCard({
  workspaceId,
  fieldId,
  id,
}: {
  id: string;
  workspaceId: string;
  fieldId: string;
}): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      workspaceId,
      fieldId,
      uid: auth?.currentUser?.uid,
      id,
    },
    {
      token,
      action: "card/delete",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
