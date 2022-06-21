import { server } from "..";

export function fetchWorkspaces({
  token,
  uid,
}: {
  token?: string;
  uid?: string;
}) {
  return fetch(`${server}/api/workspace/getworkspaces`, {
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    method: "POST",
    body: JSON.stringify({ uid }),
  })
    .then((response) => {
      try {
        return response.json();
      } catch (error) {
        return { success: false, error };
      }
    })
    .catch((error) => {
      return { success: false, error };
    });
}
