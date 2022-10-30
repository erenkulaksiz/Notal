import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";

export async function starWorkspace(
  id: string
): Promise<{ success: boolean; error?: string }> {
  // Send a star workspace request to API.
  if (!id) return { success: false, error: "no-id" };

  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      id,
      uid: auth?.currentUser?.uid,
    },
    {
      token,
      action: "star",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
