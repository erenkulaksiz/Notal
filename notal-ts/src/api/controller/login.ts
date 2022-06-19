import { connectToDatabase } from "@lib/mongodb";
import { ValidateToken } from "@utils/api/validateToken";
import { Log } from "@utils/logger";
import { server } from "@utils/server";
import { NextApiRequest, NextApiResponse } from "next";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");
const { formatDate, SendTelegramMessage } = require("@utils");

/**
 * Send Telegram notification about new login and data
 */
export async function login(req: NextApiRequest, res: NextApiResponse) {
  let token = "";
  const { db } = await connectToDatabase();
  const users = await db.collection("users");

  const { body } = req;
  if (!body) return reject({ reason: "no-token", res });

  token = body.token;
  if (!token || token.length == 0) return reject({ reason: "no-token", res });

  const validateUser = await ValidateUser({ token });
  const user = await users.findOne({ uid: validateUser.decodedToken.user_id });

  if (!validateUser && !validateUser.decodedToken.success)
    return reject("invalid-token");

  await SendTelegramMessage({
    message: `LOGIN
USERNAME: ${user?.username}
EMAIL: ${validateUser.decodedToken.email}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDate(Date.now())}
TS: ${Date.now()}
URL: ${server}
ENV: ${process.env.NODE_ENV}`,
  });

  return accept({ res });
}
