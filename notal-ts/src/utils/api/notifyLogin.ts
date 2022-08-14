import { server } from "..";

/**
 * Notifies server about a new login.
 */
export async function NotifyLogin(token?: string) {
  if (!token) return;
  await fetch(`${server}/api/user/login`, {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    body: JSON.stringify({ token }),
  });
}
