import { AddCardTypes } from "./AddCard.d";
import { AddCardActionType, CardAction } from "./AddCard.d";

export function reducer(state: AddCardTypes, action: CardAction): AddCardTypes {
  switch (action.type) {
    case AddCardActionType.SET_TITLE:
      return { ...state, title: action.payload };
    case AddCardActionType.SET_DESC:
      return { ...state, desc: action.payload };
    case AddCardActionType.RESET_ALL:
      return { ...state, title: "", desc: "" };
    case AddCardActionType.SET_COLOR:
      return { ...state, color: action.payload };
    case AddCardActionType.SET_USE_COLOR:
      return { ...state, useColor: action.payload };
    default:
      return state;
  }
}
