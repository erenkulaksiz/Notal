import Cookies from "js-cookie";
import { User } from "firebase/auth";

import { Log } from "..";

import type { NotalRootProps } from "@types";

export const CheckToken = async ({
  token,
  props,
  user,
}: {
  token?: string | null;
  props: NotalRootProps;
  user?: User | null;
}) => {
  //Log.debug("jwtyi kontrol edicem bi canım");
  Log.debug(
    "Checking token, " +
      (token ? "token exist" : "token doesnt exist") +
      " val: ",
    props.validate,
    " userVal: ",
    user
  );
  if (
    (props.validate?.error &&
      props.validate?.error == "auth/id-token-expired") ||
    props.validate?.error == "auth/argument-error" ||
    props.validate?.error == "validation-error" ||
    (props.validate?.error == "no-token" && user)
  ) {
    if (token) await Cookies.set("auth", token);
    Log.debug("Have to reload! checkToken");
    return false;
  } else {
    if (!props.validate?.error) {
      return true;
    }
    return false;
  }
};
