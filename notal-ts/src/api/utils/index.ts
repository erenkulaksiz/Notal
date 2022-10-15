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
  if (data) {
    res.status(status).json({ success: true, data });
    return;
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
