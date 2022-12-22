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
  getuserdata,
} from "./workspace";
import { complete } from "./onboarding/complete";

import { accept, checkUserAuth } from "@api/utils";

type APIReturnType = (req: NextApiRequest, res: NextApiResponse) => void;

export interface ControllerReturnType {
  ping: APIReturnType;
  isauthed: APIReturnType;
  user: {
    login: APIReturnType;
  };
  workspace: {
    getworkspaces: APIReturnType;
    getworkspace: APIReturnType;
    getuserdata: APIReturnType;
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
  onboarding: {
    complete: APIReturnType;
  };
}

export function Controller() {
  return {
    ping: (req: NextApiRequest, res: NextApiResponse) => {
      return accept({ res, data: { pong: true } });
    },
    isauthed: (req, res) =>
      checkUserAuth({
        req,
        res,
        func: async (req: NextApiRequest, res: NextApiResponse) =>
          accept({ res }),
      }), // experimental feature
    user: {
      login,
    },
    workspace: {
      getworkspaces: (req, res) =>
        checkUserAuth({ req, res, func: getworkspaces }),
      getworkspace,
      getuserdata: (req, res) => checkUserAuth({ req, res, func: getuserdata }),
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
    onboarding: {
      complete: (req, res) => checkUserAuth({ req, res, func: complete }),
    },
  } as ControllerReturnType;
}
