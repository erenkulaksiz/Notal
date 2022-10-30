import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";
import { FieldTypes } from "@types";

/**
 * reorder card from workspace
 * @param title string
 * @param id string
 */
export async function reorderCard({
  destination,
  source,
  id,
  cardId,
}: {
  destination: { droppableId: string; index: number };
  source: { droppableId: string; index: number };
  id: string; // workspace id
  cardId: string; //
}): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      id,
      uid: auth?.currentUser?.uid,
      destination,
      source,
      cardId,
    },
    {
      token,
      action: "card/reorder",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
