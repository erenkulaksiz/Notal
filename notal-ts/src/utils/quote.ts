import { CONSTANTS } from "@constants";

export enum QUOTE_TYPES {
  WORKSPACE_TITLE = "WORKSPACE_TITLE",
  WORKSPACE_CARD_TITLE = "WORKSPACE_CARD_TITLE",
  WORKSPACE_FIELD_TITLE = "WORKSPACE_FIELD_TITLE",
}

export function getRandomQuote(type: string) {
  switch (type) {
    case QUOTE_TYPES.WORKSPACE_TITLE:
      return CONSTANTS.PLACEHOLDER_WORKSPACE_TITLES[
        Math.floor(
          Math.random() * CONSTANTS.PLACEHOLDER_WORKSPACE_TITLES.length
        )
      ];
    case QUOTE_TYPES.WORKSPACE_CARD_TITLE:
      return CONSTANTS.PLACEHOLDER_WORKSPACE_CARD_TITLES[
        Math.floor(
          Math.random() * CONSTANTS.PLACEHOLDER_WORKSPACE_CARD_TITLES.length
        )
      ];
    case QUOTE_TYPES.WORKSPACE_FIELD_TITLE:
      return CONSTANTS.PLACEHOLDER_WORKSPACE_FIELD_TITLES[
        Math.floor(
          Math.random() * CONSTANTS.PLACEHOLDER_WORKSPACE_FIELD_TITLES.length
        )
      ];
  }
}
