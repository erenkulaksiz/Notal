import { useReducer, useState, useRef } from "react";

import {
  Modal,
  Button,
  Tab,
  Input,
  WorkspaceFieldCard,
  Colorpicker,
  Checkbox,
} from "@components";
import { AddIcon, CrossIcon, CheckIcon } from "@icons";
import { AddCardModalProps, AddCardActionType } from "./AddCard.d";
import { reducer } from "./reducer";
import { LIMITS } from "@constants/limits";
import { getRandomQuote, QUOTE_TYPES } from "@utils";

export function AddCardModal({
  open,
  onClose,
  onAdd,
  fieldTitle,
}: AddCardModalProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [state, dispatch] = useReducer(reducer, {
    title: "",
    desc: "",
    useColor: false,
    color: "#ff0000",
  });
  const randomCardPlaceholder = useRef(
    getRandomQuote(QUOTE_TYPES.WORKSPACE_CARD_TITLE)
  );

  function close() {
    onClose();
    // get a random quote on close
    randomCardPlaceholder.current = getRandomQuote(
      QUOTE_TYPES.WORKSPACE_CARD_TITLE
    );
    dispatch({ type: AddCardActionType.RESET_ALL, payload: "" });
  }

  function submit() {
    if (state.title?.trim() && state.desc?.trim()) {
      if (
        state.title?.trim().length <
        LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
      ) {
        return dispatch({
          type: AddCardActionType.SET_TITLE_ERROR,
          payload: `Title must be atleast ${LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH} characters long.`,
        });
      }
      if (
        state.title?.trim().length >
        LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
      ) {
        return dispatch({
          type: AddCardActionType.SET_TITLE_ERROR,
          payload: `Title can be maximum ${LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH} characters long.`,
        });
      }
      if (
        state.desc &&
        state.desc?.trim().length >
          LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH
      ) {
        return dispatch({
          type: AddCardActionType.SET_DESC_ERROR,
          payload: `Description can be maximum ${LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH} characters long.`,
        });
      }
    } else if (state.title?.trim() && !state.desc?.trim()) {
      if (
        state.title?.trim().length <
        LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
      ) {
        return dispatch({
          type: AddCardActionType.SET_TITLE_ERROR,
          payload: `Title must be atleast ${LIMITS.MIN.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH} characters long.`,
        });
      }
      if (
        state.title?.trim().length >
        LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
      ) {
        return dispatch({
          type: AddCardActionType.SET_TITLE_ERROR,
          payload: `Title can be maximum ${LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH} characters long.`,
        });
      }
    } else if (!state.title?.trim() && !state.desc?.trim()) {
      dispatch({
        type: AddCardActionType.SET_TITLE_ERROR,
        payload: `Please enter an title or description.`,
      });
      return dispatch({
        type: AddCardActionType.SET_DESC_ERROR,
        payload: `Please enter an title or description.`,
      });
    }
    onAdd({
      title: state.title,
      desc: state.desc,
      color: state.useColor ? state.color : "",
    });
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      className="w-[90%] sm:w-[600px] p-4 px-5"
      animate
    >
      <Modal.Title animate>
        <AddIcon size={24} fill="currentColor" />
        <span className="text-lg font-medium ml-1">
          Add Card to {fieldTitle}
        </span>
      </Modal.Title>
      <Modal.Body animate>
        <div className="dark:p-1 dark:border-2 dark:border-neutral-800 w-full mt-2 rounded-lg">
          <WorkspaceFieldCard
            card={{
              title: state.title?.trim() || "Enter card title",
              desc: state.desc?.trim(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              color: state.useColor ? state.color : "",
            }}
            fieldId=""
            index={0}
          />
        </div>
        <Tab
          id="addCardTab"
          selected={selectedTab}
          onSelect={(index) => setSelectedTab(index)}
          headerContainerClassName="mt-4"
          globalTabViewClassName="flex flex-col pt-2 gap-2 flex-1"
          headerVisible={false}
        >
          <Tab.TabView title="Card">
            <label
              htmlFor="cardTitle"
              className="flex flex-row items-center gap-2"
            >
              <span>Card Title</span>
              {state.title && (
                <div className="text-xs text-neutral-400">
                  {`${state?.title?.trim().length} / ${
                    LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH
                  }`}
                </div>
              )}
            </label>
            <Input
              fullWidth
              placeholder={randomCardPlaceholder.current}
              onChange={(e) =>
                dispatch({
                  type: AddCardActionType.SET_TITLE,
                  payload: e.target.value,
                })
              }
              value={state.title}
              id="cardTitle"
              maxLength={LIMITS.MAX.WORKSPACE_CARD_TITLE_CHARACTER_LENGTH}
              onEnterPress={() => submit()}
            />
            {state.errors && state?.errors?.title && (
              <span className="text-red-500">{state.errors.title}</span>
            )}
            <label
              htmlFor="cardDesc"
              className="flex flex-row items-center gap-2"
            >
              <span>Card Description</span>
              {state.desc && (
                <div className="text-xs text-neutral-400">
                  {`${state?.desc?.trim().length} / ${
                    LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH
                  }`}
                </div>
              )}
            </label>
            <Input
              fullWidth
              placeholder="Start typing..."
              onChange={(e) =>
                dispatch({
                  type: AddCardActionType.SET_DESC,
                  payload: e.target.value,
                })
              }
              height="h-40"
              className="p-2"
              value={state.desc}
              id="cardDesc"
              maxLength={LIMITS.MAX.WORKSPACE_CARD_DESC_CHARACTER_LENGTH}
              textarea
            />
            {state.errors && state?.errors?.desc && (
              <span className="text-red-500">{state.errors.desc}</span>
            )}
            <label htmlFor="cardColor">Card Color</label>
            <div className="w-full flex flex-row gap-2 h-6">
              <Checkbox
                checked={state.useColor}
                onChange={(value) =>
                  dispatch({
                    type: AddCardActionType.SET_USE_COLOR,
                    payload: value,
                  })
                }
                id="useColor"
              >
                Use Color
              </Checkbox>
              {state.useColor && (
                <Colorpicker
                  color={state.color}
                  onChange={(color) => {
                    if (color.length == 1) {
                      return dispatch({
                        type: AddCardActionType.SET_USE_COLOR,
                        payload: false,
                      });
                    }
                    dispatch({
                      type: AddCardActionType.SET_COLOR,
                      payload: color,
                    });
                  }}
                  id="cardColor"
                />
              )}
            </div>
          </Tab.TabView>
          <Tab.TabView title="Tags">selam</Tab.TabView>
          <Tab.TabView title="Image">selam</Tab.TabView>
        </Tab>
      </Modal.Body>
      <Modal.Footer className="justify-between items-end flex-1 pt-4" animate>
        <Button
          light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
          onClick={() => close()}
          fullWidth="w-[49%]"
        >
          <CrossIcon size={24} fill="currentColor" />
          Cancel
        </Button>
        <Button onClick={() => submit()} fullWidth="w-[49%]">
          <CheckIcon size={24} fill="currentColor" />
          Add Card
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
