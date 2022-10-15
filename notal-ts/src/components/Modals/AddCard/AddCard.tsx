import { useReducer, useState } from "react";

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

  function close() {
    onClose();
    dispatch({ type: AddCardActionType.RESET_ALL, payload: "" });
  }

  function submit() {
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
      className="w-[90%] sm:w-[400px] min-h-[550px] p-4 px-5 relative"
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
              title: state.title || "Enter card title",
              desc: state.desc,
              _id: "",
              createdAt: Date.now(),
              updatedAt: Date.now(),
              owner: "",
              color: state.useColor ? state.color : "",
            }}
            fieldId=""
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
              height="h-20"
              className="p-2"
              value={state.desc}
              id="cardDesc"
              maxLength={356}
              textarea
            />

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
                  onChange={(color) =>
                    dispatch({
                      type: AddCardActionType.SET_COLOR,
                      payload: color,
                    })
                  }
                  id="cardColor"
                />
              )}
            </div>
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
