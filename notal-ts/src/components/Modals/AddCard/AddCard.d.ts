import { CardTypes } from "@types";
import { ReactNode } from "react";

export interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (card: CardTypes) => void;
  fieldTitle?: string;
}

export enum AddCardActionType {
  SET_TITLE = "SET_TITLE",
  SET_DESC = "SET_DESC",
  RESET_ALL = "RESET_ALL",
  SET_COLOR = "SET_COLOR",
  SET_USE_COLOR = "SET_USE_COLOR",
}

export interface CardAction {
  type: AddCardActionType;
  payload: any;
}

export interface AddCardTypes extends CardTypes {
  useColor: boolean;
}
