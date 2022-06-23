import { Log, server } from "@utils";

import { connectToDatabase } from "@lib/mongodb";
import { ValidateUser } from "./validateUser";

import { formatString, formatDate } from "@utils";
import { generateRandomUsername } from "@api/controller/validate";

import { SendTelegramMessage } from "@utils";

export interface ValidateTokenReturnType {
  success: boolean;
  error?:
    | string
    | {
        errorCode: string;
      };
  data?: object;
}

/**
 * Validate firebase jwt token with mongodb data
 */
export async function ValidateToken({
  token,
}: {
  token: string;
}): Promise<ValidateTokenReturnType> {
  const { db } = await connectToDatabase();
  const users = await db.collection("users");

  if (!token) return { error: "no-token", success: false };

  const validateUser = await ValidateUser({ token });

  if (validateUser.success && validateUser.decodedToken.success) {
    let user = await users.findOne({ uid: validateUser.decodedToken.user_id });

    if (!user) {
      // register user - check and register username
      let generateUsername = "";
      let generated = false;

      while (generated == false) {
        generateUsername = formatString(
          generateRandomUsername({
            email: validateUser.decodedToken.email,
          })
        ).toLowerCase();
        const checkusername = await users.findOne({
          username: generateUsername,
        });
        if (!checkusername) generated = true;
      }

      const newUser = {
        email: validateUser.decodedToken.email,
        username: generateUsername,
        uid: validateUser.decodedToken.user_id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        fullname: validateUser.decodedToken.name,
        avatar: validateUser.decodedToken.picture,
        provider: validateUser.decodedToken.firebase.sign_in_provider || "",
      };

      Log.debug("USER NOT FOUND | GENERATED USER:", newUser);

      await users.insertOne({
        ...newUser,
      });
      user = await users.findOne({ uid: validateUser.decodedToken.user_id });

      await SendTelegramMessage({
        message: `NEW USER
EMAIL: ${validateUser.decodedToken.email}
USERNAME: ${newUser.username}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDate(Date.now())}
TIMESTAMP: ${Date.now()}
PROVIDER: ${validateUser.decodedToken.firebase.sign_in_provider}`,
      });
    }

    return {
      success: true,
      data: {
        username: user?.username,
        uid: user?.uid,
        fullname: user?.fullname,
        avatar: user?.avatar,
        email: user?.email,
      },
    };
  }

  return {
    success: false,
    error: validateUser.decodedToken.errorCode,
  };

  /*
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
  */
}
