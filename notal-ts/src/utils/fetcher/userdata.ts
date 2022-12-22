import { server } from "..";

export function fetchUserData({
  token,
  username,
  uid,
}: {
  token?: string;
  username?: string;
  uid?: string;
}) {
  return fetch(`${server}/api/workspace/getuserdata`, {
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    method: "POST",
    body: JSON.stringify({ username, uid }),
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
