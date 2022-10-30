import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";
import { FieldTypes } from "@types";

export interface EditFieldParams extends FieldTypes {
  workspaceId: string;
  id: string;
}

/**
 * remove field from workspace
 * @param title string
 * @param id string
 */
export async function editField({
  workspaceId,
  title,
  id,
}: EditFieldParams): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      workspaceId,
      uid: auth?.currentUser?.uid,
      id,
      title,
    },
    {
      token,
      action: "field/edit",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
