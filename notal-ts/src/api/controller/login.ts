import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@lib/mongodb";
import { server } from "@utils/server";
import { ValidateUser } from "@utils/api/validateUser";
import { accept, reject } from "@api/utils";
import { formatDateToHuman, SendTelegramMessage } from "@utils";
import { CONSTANTS } from "@constants";

/**
 * Send Telegram notification about new login and data
 */
export async function login(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const usersCollection = await db.collection("users");

  const { body } = req;
  if (!body || !body.token) return reject({ reason: "no-token", res });
  const { token } = body;

  if (!token || token.length == 0) return reject({ reason: "no-token", res });

  const validateUser = await ValidateUser({ token });
  const user = await usersCollection.findOne({
    uid: validateUser.decodedToken.user_id,
  });

  if (validateUser && !validateUser.decodedToken)
    return reject({ reason: validateUser.decodedToken.errorCode, res });

  SendTelegramMessage({
    message: `LOGIN
USERNAME: @${user?.username}
EMAIL: ${validateUser.decodedToken.email}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDateToHuman({
      date: Date.now(),
      output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
    })}
TS: ${Date.now()}
URL: ${server}
ENV: ${process.env.NODE_ENV}
VER: ${CONSTANTS.APP_VERSION}
PROVIDER: ${validateUser.decodedToken.firebase.sign_in_provider}
PLATFORM: web`,
  });

  return accept({ res, action: "user_logined" });
}
