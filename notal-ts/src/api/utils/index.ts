import { NextApiRequest, NextApiResponse } from "next";

import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { ValidateUser } from "@utils/api/validateUser";
import { Log } from "@utils";

interface acceptProps {
  data?: any;
  status?: number;
  action?: string;
  res: NextApiResponse;
}

interface rejectProps {
  reason?: string;
  status?: number;
  res: NextApiResponse;
}

export function accept({
  data,
  status = 200,
  action = "defaultAction",
  res,
}: acceptProps) {
  Log.debug("accept: ", data, status, action);
  if (data) {
    return res.status(status).json({ success: true, data });
  }
  res.status(status).json({ success: true });
}

export function reject({
  reason = "invalid-params",
  status = 400,
  res,
}: rejectProps) {
  Log.debug("reject: ", reason);
  res.status(status).json({ success: false, error: reason });
}

export function generateRandomUsername({ email }: { email: string }) {
  const now = Date.now().toString();
  return email.split("@")[0] + now.substring(now.length - 3);
}

/**
 * check whether user is authenticated or not
 */
export async function checkUserAuth({
  req,
  res,
  func,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  func: (req: NextApiRequest, res: NextApiResponse<any>) => Promise<void>;
}): Promise<void> {
  const { body } = req;
  if (!body && !body.uid) return reject({ res, reason: "no-auth-params" }); // assuming all auth routes have uid in body
  const { uid } = body;
  const bearer = getTokenFromHeader(req);
  if (!bearer) return reject({ res, reason: "no-auth" });
  const validateUser = await ValidateUser({ token: bearer });
  if (validateUser && !validateUser.decodedToken)
    return reject({ reason: validateUser.errorCode, res });
  if (validateUser.decodedToken.uid !== uid)
    return reject({ res, reason: "auth-uid-error" });

  return func(req, res);
}
