import { Log } from "@utils/logger";
import { NextApiRequest, NextApiResponse } from "next";

const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");
const { formatDate, SendTelegramMessage } = require("@utils");

export async function login(req: NextApiRequest, res: NextApiResponse) {
  let token = "";

  const { body } = req;
  if (!body) return reject({ reason: "no-token", res });

  token = body.token;
  if (!token || token.length == 0) return reject({ reason: "no-token", res });

  const validateUser = await ValidateUser({ token });

  if (!validateUser && !validateUser.decodedToken.success)
    return reject("invalid-token");

  await SendTelegramMessage({
    message: `LOGIN
EMAIL: ${validateUser.decodedToken.email}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDate(Date.now())}`,
  });

  return accept({ res });
}
