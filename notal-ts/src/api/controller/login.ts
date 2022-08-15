import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@lib/mongodb";
import { server } from "@utils/server";
import { ValidateUser } from "@utils/api/validateUser";
import { accept, reject } from "@api/utils";
import { formatDate, SendTelegramMessage } from "@utils";

/**
 * Send Telegram notification about new login and data
 */
export async function login(req: NextApiRequest, res: NextApiResponse) {
  let token = "";
  const { db } = await connectToDatabase();
  const usersCollection = await db.collection("users");

  const { body } = req;
  if (!body) return reject({ reason: "no-token", res });

  token = body.token;
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
TIME: ${formatDate(Date.now())}
TS: ${Date.now()}
URL: ${server}
ENV: ${process.env.NODE_ENV}
PROVIDER: ${validateUser.decodedToken.firebase.sign_in_provider}`,
  });

  return accept({ res, action: "user_logined" });
}
