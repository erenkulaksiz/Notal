import { ObjectId } from "mongodb";

import { Log } from "@utils";
import { connectToDatabase } from "@lib/mongodb";
import { ValidateUser } from "./validateUser";
import { formatString, formatDate } from "@utils";
import { generateRandomUsername } from "@api/utils";
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

/*
  email: validateUser.decodedToken.email,
  username: generateUsername,
  uid: validateUser.decodedToken.user_id,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  fullname: validateUser.decodedToken.name,
  avatar: validateUser.decodedToken.picture,
  provider: validateUser.decodedToken.firebase.sign_in_provider || "",
 */

interface UserTypes {
  email?: string;
  username: string;
  uid: string;
  createdAt: number;
  updatedAt: number;
  fullname?: string;
  avatar?: string;
  provider?: string;
  _id?: ObjectId;
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
  const usersCollection = await db.collection("users");

  if (!token) return { error: "no-token", success: false };

  const validateUser = await ValidateUser({ token });

  if (validateUser && !validateUser?.decodedToken) {
    return {
      success: false,
      error: validateUser?.errorCode,
    };
  }

  let user = await usersCollection.findOne({
    uid: validateUser.decodedToken.user_id,
  });

  if (!user) {
    // register user - check and register username
    let generateUsername = "";
    let generated = false;

    while (generated == false) {
      Log.debug("validateUser:", validateUser);
      generateUsername = formatString(
        generateRandomUsername({
          email: validateUser.decodedToken.email ?? "error",
        })
      ).toLowerCase();
      const checkusername = await usersCollection.findOne({
        username: generateUsername,
      });
      if (!checkusername) generated = true;
    }

    const newUser: UserTypes = {
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

    await usersCollection
      .insertOne({
        ...newUser,
      })
      .then((result) => {
        user = {
          ...newUser,
          _id: result.insertedId,
        };
      });

    SendTelegramMessage({
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
