import { Log, server } from "@utils";

export interface ValidateTokenReturnType {
  success: boolean;
  error: string;
  data?: object;
}

/**
 * Convert JWT token to user data via API
 */
export async function ValidateToken({
  token,
}: {
  token: string;
}): Promise<ValidateTokenReturnType> {
  if (!token) return { error: "no-token", success: false };

  const data = await fetch(`${server}/api/user/validate`, {
    headers: new Headers({ "content-type": "application/json" }),
    method: "POST",
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .catch((error) => {
      return {
        success: false,
        error: { code: "validation-error", message: error },
      };
    });

  if (data.success) {
    return data;
  }
  Log.debug("err validate token:", data);
  return {
    error: data.error.code ? data.error.code : data.error,
    success: false,
  };
}
