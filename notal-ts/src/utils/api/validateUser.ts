import { ErrorFn } from "firebase/auth";
import { Log } from "..";

const admin = require("firebase-admin");
const googleService = JSON.parse(process.env.GOOGLE_SERVICE || "");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(googleService),
  });
}

/**
 * Convert user token to user data via Firebase
 */
export async function ValidateUser({ token }: { token: string }) {
  if (!token) return { success: false, error: "no-token" };

  const decodedToken = await admin
    .auth()
    .verifyIdToken(token)
    .catch((error: ErrorFn) => {
      return { success: false, error };
    });

  if (!decodedToken && decodedToken?.error)
    return { success: false, error: "invalid-token", code: decodedToken.error };
  return { success: true, decodedToken: { success: true, ...decodedToken } };
}
