import { NextApiRequest, NextApiResponse } from "next";

import { login } from "./login";
import {
  getworkspaces,
  getworkspace,
  star,
  create,
  deleteworkspace,
  togglevisibility,
  addfield,
  deletefield,
  editfield,
  addcard,
  deletecard,
} from "./workspace";
import { accept } from "@api/utils";

type APIReturnType = (req: NextApiRequest, res: NextApiResponse) => void;

export interface ControllerReturnType {
  ping: APIReturnType;
  user: {
    login: APIReturnType;
  };
  workspace: {
    getworkspaces: APIReturnType;
    getworkspace: APIReturnType;
    star: APIReturnType;
    create: APIReturnType;
    delete: APIReturnType;
    togglevisibility: (
      req: NextApiRequest,
      res: NextApiResponse
    ) => Promise<void>;
    field: {
      add: APIReturnType;
      delete: APIReturnType;
      edit: APIReturnType;
    };
    card: {
      add: APIReturnType;
      delete: APIReturnType;
    };
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
      delete: deleteworkspace,
      togglevisibility,
      field: {
        add: addfield,
        delete: deletefield,
        edit: editfield,
      },
      card: {
        add: addcard,
        delete: deletecard,
      },
    },
  } as ControllerReturnType;
}
