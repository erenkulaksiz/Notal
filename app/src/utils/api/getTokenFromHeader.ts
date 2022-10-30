import { NextApiRequest } from "next";

export function getTokenFromHeader(req: NextApiRequest) {
  const bearer = req.headers["authorization"];
  const bearerToken = bearer?.split(" ")[1];
  if (typeof bearerToken == "undefined") return false;
  return bearerToken;
}
