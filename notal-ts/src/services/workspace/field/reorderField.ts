import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";
import { FieldTypes } from "@types";

/**
 * reorder field from workspace
 * @param title string
 * @param id string
 */
export async function reorderField({
  destination,
  source,
  fieldId,
  id,
}: {
  destination: { droppableId: string; index: number };
  source: { droppableId: string; index: number };
  fieldId: string;
  id: string; // workspace id
}): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      id,
      uid: auth?.currentUser?.uid,
      destination,
      source,
      fieldId,
    },
    {
      token,
      action: "field/reorder",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
