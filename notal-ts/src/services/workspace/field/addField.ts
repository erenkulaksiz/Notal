import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";
import type { FieldTypes } from "@types";

export interface AddFieldParams extends FieldTypes {
  id: string;
}

/**
 * add field to corresponding workspace
 * @param title string
 * @param id string
 */
export async function addField({
  title,
  id,
}: AddFieldParams): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      title,
      uid: auth?.currentUser?.uid,
      id,
    },
    {
      token,
      action: "field/add",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
