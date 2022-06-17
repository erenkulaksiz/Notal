import { Log } from "@utils/logger";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

const admin = require("firebase-admin");

const { Controller } = require("@api/controller");
const { accept, reject } = require("@api/utils");

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
  res: NextResponse
) {
  if (req.method !== "POST") return reject({ res });

  const { slug } = req.query;

  if (slug.length == 0) return reject({ res });

  let ExecuteController = Controller(req, res);

  if (slug.length == 1) {
    ExecuteController = ExecuteController[slug[0]];
  } else if (slug.length == 2) {
    ExecuteController = ExecuteController[slug[0]][slug[1]];
  } else if (slug.length == 3) {
    ExecuteController = ExecuteController[slug[0]][slug[1]][slug[2]];
  }

  if (typeof ExecuteController == "function") {
    return await ExecuteController(slug[slug.length - 1]); // Always send last slug to api route
  }
  reject({ res });
}
