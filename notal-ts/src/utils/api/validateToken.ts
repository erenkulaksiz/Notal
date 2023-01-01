import { ObjectId } from "mongodb";

import { Log } from "@utils";
import { connectToDatabase } from "@lib/mongodb";
import { ValidateUser } from "./validateUser";
import { formatString, formatDateToHuman } from "@utils";
import { generateRandomUsername } from "@api/utils";
import { SendTelegramMessage, server } from "@utils";
import { CONSTANTS } from "@constants";

export interface ValidateTokenReturnType {
  success: boolean;
  error?:
    | string
    | {
        errorCode: string;
      };
  data?: any; // #TODO: define data type
}

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
  onboarding?: {
    completed: boolean;
    date?: number; // timestamp
  };
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
    let generatedUsername = "";
    let generatedLength = 3; // Defaults to 3 characters
    let generated = false;

    while (!generated) {
      Log.debug("validateUser:", validateUser);
      generatedUsername = formatString(
        generateRandomUsername({
          email: validateUser.decodedToken.email ?? "error",
          length: generatedLength,
        })
      ).toLowerCase();
      const checkusername = await usersCollection.findOne({
        username: generatedUsername,
      });
      if (!checkusername) generated = true;
      else {
        generatedLength++;
      }
    }

    const newUser: UserTypes = {
      email: validateUser.decodedToken.email,
      username: generatedUsername,
      uid: validateUser.decodedToken.user_id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fullname: validateUser.decodedToken.name,
      avatar: validateUser.decodedToken.picture,
      provider: validateUser.decodedToken.firebase.sign_in_provider || "",
      onboarding: {
        completed: false,
      },
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
USERNAME: ${newUser.username}
EMAIL: ${validateUser.decodedToken.email}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDateToHuman({
        date: Date.now(),
        output: "{DAY} {MONTH} {YEAR} {HOURS}:{MINUTES}:{SECONDS}",
      })}
TS: ${Date.now()}
URL: ${server}
ENV: ${process.env.NODE_ENV}
PROVIDER: ${validateUser.decodedToken.firebase.sign_in_provider}
VER: ${CONSTANTS.APP_VERSION}
PLATFORM: web`,
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
      onboarding: user?.onboarding ?? null,
    },
  };
}
