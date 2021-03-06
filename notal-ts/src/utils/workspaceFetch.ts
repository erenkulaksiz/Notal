import { server } from "./server";

export async function workspaceFetch(
  { ...rest },
  { token, action }: { token?: string | null; action: string }
) {
  return await fetch(`${server}/api/workspace/${action}`, {
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    method: "POST",
    body: JSON.stringify({ ...rest }),
  })
    .then((response) => response.json())
    .catch((error) => {
      return { error, success: false };
    });
}
