import { NextApiResponse } from "next";

const { Log } = require("@utils");

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
  data = {},
  status = 200,
  action = "defaultAction",
  res,
}: acceptProps) {
  Log.debug("accept: ", data, status, action);
  if (data) return res.status(status).send({ success: true, data });
  return res.status(status).send({ success: true });
}

export function reject({
  reason = "invalid-params",
  status = 400,
  res,
}: rejectProps) {
  Log.debug("reject: ", reason);
  return res.status(status).send({ success: false, error: reason });
}

export function generateRandomUsername({ email }: { email: string }) {
  const now = Date.now().toString();
  return email.split("@")[0] + now.substring(now.length - 3);
}
