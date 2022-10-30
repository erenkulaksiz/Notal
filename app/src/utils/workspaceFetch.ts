import { server } from "./server";

// send data
export async function workspaceFetch(
  { ...data },
  { token, action }: { token?: string | null; action: string }
) {
  return await fetch(`${server}/api/workspace/${action}`, {
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    method: "POST",
    body: JSON.stringify({ ...data }),
  })
    .then((response) => response.json())
    .catch((error) => {
      return { error, success: false };
    });
}
