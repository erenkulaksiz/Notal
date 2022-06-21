import { formatString } from "@utils/formatString";
import { NextApiRequest, NextApiResponse } from "next";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");

const { connectToDatabase } = require("@lib/mongodb");

const { formatDate, Log, SendTelegramMessage } = require("@utils");

export function generateRandomUsername({ email }: { email: string }) {
  const now = Date.now().toString();
  return email.split("@")[0] + now.substring(now.length - 3);
}

/**
 * Validate incoming requests by returning user data
 */
export async function validate(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();

  const usersCollection = await db.collection("users");

  let token = "";

  const { body } = req;
  if (!body) return reject({ reason: "no-token", res });

  token = body.token;

  if (!token) return reject({ reason: "no-token", res });
  const validateUser = await ValidateUser({ token });

  if (validateUser.success && validateUser.decodedToken.success) {
    // validated, now check db

    let user = await usersCollection.findOne({
      uid: validateUser.decodedToken.user_id,
    });

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
        const checkusername = await usersCollection.findOne({
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

      await usersCollection.insertOne({
        ...newUser,
      });
      user = await usersCollection.findOne({
        uid: validateUser.decodedToken.user_id,
      });

      await SendTelegramMessage({
        message: `NEW USER
EMAIL: ${validateUser.decodedToken.email}
USERNAME: ${newUser.username}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDate(Date.now())}
TIMESTAMP: ${Date.now()}`,
      });
    }

    return accept({
      data: {
        username: user.username,
        uid: user.uid,
        fullname: user.fullname,
        avatar: user.avatar,
        email: user.email,
      },
      res,
      action: "validate",
    });
  }
  return reject({ res });
}
