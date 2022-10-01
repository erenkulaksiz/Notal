import { NextApiRequest, NextApiResponse } from "next";

import { login } from "./login";
import {
  getworkspaces,
  getworkspace,
  star,
  create,
  deleteWorkspace,
  toggleVisibility,
  addfield,
  deletefield,
  editfield,
  addcard,
} from "./workspace";
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
    toggleVisibility: (
      req: NextApiRequest,
      res: NextApiResponse
    ) => Promise<void>;
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
      toggleVisibility,
      field: {
        add: addfield,
        delete: deletefield,
        edit: editfield,
      },
      card: {
        add: addcard,
      },
    },
  } as ControllerReturnType;
}
