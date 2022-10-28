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
  reorderfield,
  reordercard,
} from "./workspace";
import { accept, checkUserAuth } from "@api/utils";

type APIReturnType = (req: NextApiRequest, res: NextApiResponse) => void;

export interface ControllerReturnType {
  ping: APIReturnType;
  isAuthed: APIReturnType;
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
      reorder: APIReturnType;
    };
    card: {
      add: APIReturnType;
      delete: APIReturnType;
      reorder: APIReturnType;
    };
  };
}

export function Controller() {
  return {
    ping: (req: NextApiRequest, res: NextApiResponse) => {
      return accept({ res, data: { pong: true } });
    },
    isAuthed: (req, res) => checkUserAuth({ req, res, func: login }), // experimental feature
    user: {
      login: (req, res) => checkUserAuth({ req, res, func: login }),
    },
    workspace: {
      getworkspaces: (req, res) =>
        checkUserAuth({ req, res, func: getworkspaces }),
      getworkspace,
      star: (req, res) => checkUserAuth({ req, res, func: star }),
      create: (req, res) => checkUserAuth({ req, res, func: create }),
      delete: (req, res) => checkUserAuth({ req, res, func: deleteworkspace }),
      togglevisibility: (req, res) =>
        checkUserAuth({ req, res, func: togglevisibility }),
      field: {
        add: (req, res) => checkUserAuth({ req, res, func: addfield }),
        delete: (req, res) => checkUserAuth({ req, res, func: deletefield }),
        edit: (req, res) => checkUserAuth({ req, res, func: editfield }),
        reorder: (req, res) => checkUserAuth({ req, res, func: reorderfield }),
      },
      card: {
        add: (req, res) => checkUserAuth({ req, res, func: addcard }),
        delete: (req, res) => checkUserAuth({ req, res, func: deletecard }),
        reorder: (req, res) => checkUserAuth({ req, res, func: reordercard }),
      },
    },
  } as ControllerReturnType;
}
