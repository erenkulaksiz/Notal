import { Log } from "@utils";
import { NextApiRequest, NextApiResponse } from "next";

import { login } from "./login";
import { getworkspaces } from "./workspace/getworkspaces";
import { getworkspace } from "./workspace/getworkspace";
import { star } from "./workspace/star";
import { create } from "./workspace/create";
import { deleteWorkspace } from "./workspace/delete";
import { accept } from "@api/utils";

export interface ControllerReturnType {
  ping: (req: NextApiRequest, res: NextApiResponse) => void;
  user: {
    login: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  };
  workspace: {
    getworkspaces: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
    getworkspace: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
    star: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
    create: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
    delete: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  };
}

export function Controller() {
  return {
    ping: (req, res) => {
      return accept({ res, data: { pong: true } });
    },
    user: {
      login,
    },
    workspace: {
      getworkspaces,
      getworkspace,
      star,
      create,
      delete: deleteWorkspace,
    },
  } as ControllerReturnType;
}
