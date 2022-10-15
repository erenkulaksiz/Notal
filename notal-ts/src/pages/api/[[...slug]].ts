import { NextApiRequest, NextApiResponse } from "next";
const admin = require("firebase-admin");

import { Log } from "@utils/logger";
import { Controller } from "@api/controller";
import { accept, reject } from "@api/utils";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { ValidateUser } from "@utils/api/validateUser";

const googleService = JSON.parse(process.env.GOOGLE_SERVICE ?? "");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(googleService),
  });
}

type NextApiRequestWithQuery = NextApiRequest & {
  req: {
    query: string | string[];
  };
};

export default async function handler(
  req: NextApiRequestWithQuery,
  res: NextApiResponse
) {
  if (req.method !== "POST") return reject({ res });
  const { slug } = req.query;
  if (slug.length == 0) return reject({ res });
  if (!Array.isArray(slug)) return reject({ res });

  /**
   * Check if this request is authed
   */
  const { body } = req;
  if (!body && !body.uid) return reject({ res, reason: "no-auth-params" });
  const { uid } = body;
  const bearer = getTokenFromHeader(req);
  if (!bearer) return reject({ res, reason: "no-auth" });
  const validateUser = await ValidateUser({ token: bearer });
  if (validateUser && !validateUser.decodedToken)
    return reject({ reason: validateUser.errorCode, res });
  if (validateUser.decodedToken.uid !== uid)
    return reject({ res, reason: "auth-uid-error" });

  let ExecuteController: any = Controller(); // #TODO: REMOVE ANY HERE!!!!!

  slug.forEach(async (slugItem, index) => {
    if (index != slug.length - 1) {
      if (ExecuteController[slug[index]]) {
        ExecuteController = ExecuteController[slug[index]]; // go inside the object
        return;
      }
      return;
    }
    // last index, execute
    ExecuteController = ExecuteController[slugItem];

    if (typeof ExecuteController == "function") {
      return await ExecuteController(req, res);
    } else {
      return reject({ res });
    }
  });
}
