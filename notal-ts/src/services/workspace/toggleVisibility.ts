import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";

export async function toggleVisibility(
  id: string
): Promise<{ success: boolean; error?: string }> {
  // Send a change workspace visibility request to API.
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      id,
      uid: auth?.currentUser?.uid,
    },
    {
      token,
      action: "toggleVisibility",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
