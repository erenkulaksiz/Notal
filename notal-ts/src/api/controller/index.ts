import { NextRequest, NextResponse } from "next/server";

const { login } = require("./login");
//const { validate } = require("./validate");
const { getworkspaces } = require("./workspace/getworkspaces");
const { star } = require("./workspace/star");

export function Controller(req: NextRequest, res: NextResponse) {
  return {
    user: {
      //validate: async () => await validate(req, res),
      login: async () => await login(req, res),
    },
    workspace: {
      getworkspaces: async () => await getworkspaces(req, res),
      star: async () => await star(req, res),
    },
  };
}
