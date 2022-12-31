import { getAuth } from "firebase/auth";
import { workspaceFetch } from "@utils/workspaceFetch";
import { WorkspaceReducer } from "@types";

export async function editWorkspace(
  workspace: WorkspaceReducer
): Promise<{ success: boolean; error?: string }> {
  // Send a delete workspace request to API.
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  const data = await workspaceFetch(
    {
      id: workspace._id,
      uid: auth?.currentUser?.uid,
      title: workspace.title,
      desc: workspace?.desc,
      starred: workspace.starred ? true : false,
      workspaceVisible: workspace.workspaceVisible ? true : false,
    },
    {
      token,
      action: "edit",
    }
  );

  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.error };
}
