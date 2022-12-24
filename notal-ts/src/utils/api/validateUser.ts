import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { AuthError } from "firebase/auth";

import * as admin from "firebase-admin";
const googleService = JSON.parse(process.env.GOOGLE_SERVICE || "");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(googleService),
  });
}

export interface ValidateUserReturnType {
  success: boolean;
  error?: AuthError | string;
  errorCode?: string;
  decodedToken?: DecodedIdToken | any;
}

/**
 * Convert user token to user data via Firebase
 */
export async function ValidateUser({
  token,
}: {
  token: string | boolean;
}): Promise<ValidateUserReturnType> {
  if (!token || typeof token == "boolean")
    return { success: false, error: "no-token" };

  const decodedToken = await admin
    .auth()
    .verifyIdToken(token)
    .catch((error: AuthError) => {
      return { success: false, errorCode: error.code };
    });

  if (decodedToken.success == false)
    return {
      success: false,
      errorCode: decodedToken?.errorCode,
    };
  return { success: true, decodedToken };
}
