import { server } from "..";

export function fetchWorkspace({
  token,
  uid,
  id,
}: {
  token?: string;
  uid?: string;
  id?: string;
}) {
  return fetch(`${server}/api/workspace/getworkspace`, {
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    method: "POST",
    body: JSON.stringify({ uid, id }),
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
