import { NextRequest, NextResponse } from "next/server";

const { login } = require("./login");
const { validate } = require("./validate");

export function Controller(req: NextRequest, res: NextResponse) {
  return {
    user: {
      validate: async () => await validate(req, res),
      login: async () => await login(req, res),
    },
  };
}
