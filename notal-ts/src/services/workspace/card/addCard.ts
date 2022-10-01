import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";
import type { CardTypes, FieldTypes } from "@types";

export interface AddCardParams extends FieldTypes {
  card: CardTypes;
  workspaceId: string;
  id: string; // field id
}

/**
 * add card to corresponding field in workspace
 * @param card card to add
 * @param id field id
 * @param workspaceId workspace id
 */
export async function addCard({
  card,
  id,
  workspaceId,
}: AddCardParams): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      card,
      uid: auth?.currentUser?.uid,
      id,
      workspaceId,
    },
    {
      token,
      action: "card/add",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
