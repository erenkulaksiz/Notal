import { Log } from "@utils";
import { NextApiRequest, NextApiResponse } from "next";

import { login } from "./login";
//const { validate } = require("./validate");
import { getworkspaces } from "./workspace/getworkspaces";
import { star } from "./workspace/star";
import { create } from "./workspace/create";
import { deleteWorkspace } from "./workspace/delete";

export function Controller(req: NextApiRequest, res: NextApiResponse) {
  return {
    user: {
      //validate: async () => await validate(req, res),
      login: async () => await login(req, res),
    },
    workspace: {
      getworkspaces: async () => await getworkspaces(req, res),
      star: async () => await star(req, res),
      create: async () => await create(req, res),
      delete: async () => await deleteWorkspace(req, res),
    },
  };
}
