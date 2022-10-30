import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";

export async function deleteWorkspace(
  id: string
): Promise<{ success: boolean; error?: string }> {
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
}
