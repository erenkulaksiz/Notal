import { useReducer, useState } from "react";

import { Modal, Button, Tab, Input, WorkspaceFieldCard } from "@components";
import { AddIcon, CrossIcon, CheckIcon } from "@icons";
import type { AddCardModalProps } from "./AddCard.d";

enum AddCardActionType {
  SET_TITLE = "SET_TITLE",
  SET_DESC = "SET_DESC",
}

interface CardAction {
  type: AddCardActionType;
  payload: any;
}

interface AddCardState {
  title: string;
  desc: string;
}

function reducer(state: AddCardState, action: CardAction): AddCardState {
  switch (action.type) {
    case AddCardActionType.SET_TITLE:
      return { ...state, title: action.payload };
    case AddCardActionType.SET_DESC:
      return { ...state, desc: action.payload };
    default:
      return state;
  }
}

export function AddCardModal({ open, onClose, onAdd }: AddCardModalProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [state, dispatch] = useReducer(reducer, { title: "", desc: "" });

  function close() {
    onClose();
    dispatch({ type: AddCardActionType.SET_TITLE, payload: "" });
    dispatch({ type: AddCardActionType.SET_DESC, payload: "" });
  }

  function submit() {
    onAdd({
      title: state.title,
      desc: state.desc,
      owner: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _id: "",
    });
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      className="w-[90%] sm:w-[400px] min-h-[550px] p-4 px-5 relative"
      animate
    >
      <Modal.Title animate>
        <AddIcon size={24} fill="currentColor" />
        <span className="text-lg font-medium ml-1">Add Card</span>
      </Modal.Title>
      <Modal.Body animate>
        <WorkspaceFieldCard
          card={{
            title: state.title || "Enter card title",
            desc: state.desc,
            _id: "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            owner: "",
          }}
        />
        <Tab
          id="addCardTab"
          selected={selectedTab}
          onSelect={(index) => setSelectedTab(index)}
          headerContainerClassName="mt-4"
          globalTabViewClassName="flex flex-col pt-2 gap-2 flex-1"
        >
          <Tab.TabView title="Card">
            <label htmlFor="cardTitle">Card Title</label>
            <Input
              fullWidth
              placeholder="Card Title"
              onChange={(e) =>
                dispatch({
                  type: AddCardActionType.SET_TITLE,
                  payload: e.target.value,
                })
              }
              value={state.title}
              id="cardTitle"
              maxLength={40}
            />

            <label htmlFor="cardTitle">Card Description</label>
            <Input
              fullWidth
              placeholder="Card Description"
              onChange={(e) =>
                dispatch({
                  type: AddCardActionType.SET_DESC,
                  payload: e.target.value,
                })
              }
              height="h-24"
              className="p-2"
              value={state.desc}
              id="cardDesc"
              maxLength={356}
              textarea
            />
          </Tab.TabView>
          <Tab.TabView title="Tags">selam</Tab.TabView>
          <Tab.TabView title="Image">selam</Tab.TabView>
        </Tab>
      </Modal.Body>
      <Modal.Footer className="justify-between items-end flex-1" animate>
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
