import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { AuthError } from "firebase/auth";
import { Log } from "..";

const admin = require("firebase-admin");
const googleService = JSON.parse(process.env.GOOGLE_SERVICE || "");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(googleService),
  });
}

interface ValidateUserReturnType {
  success: boolean;
  error?: AuthError | string;
  decodedToken?: DecodedIdToken;
}

/**
 * Convert user token to user data via Firebase
 */
export async function ValidateUser({
  token,
}: {
  token: string | boolean;
}): Promise<ValidateUserReturnType> {
  if (!token) return { success: false, error: "no-token" };

  const decodedToken = await admin
    .auth()
    .verifyIdToken(token)
    .catch((error: AuthError) => {
      return { success: false, error, errorCode: error.code };
    });

  if (!decodedToken || decodedToken?.error || decodedToken.success === false)
    return {
      success: false,
      error: decodedToken.errorCode,
    };
  return { success: true, decodedToken: { success: true, ...decodedToken } };
}
