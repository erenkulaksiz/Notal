import { useState } from "react";

import {
  AddIcon,
  DeleteIcon,
  DragIcon,
  CrossIcon,
  CheckIcon,
  EditIcon,
} from "@icons";
import { Button, Tooltip, AddCardModal } from "@components";
import { useNotalUI, useWorkspace } from "@hooks";
import type { CardTypes, WorkspaceTypes } from "@types";
import { LIMITS } from "@constants/limits";

export function WorkspaceFieldHeader({
  field,
  ...props
}: {
  field: WorkspaceTypes["fields"];
}) {
  const NotalUI = useNotalUI();
  const workspace = useWorkspace();
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  const [editTitleValue, setEditTitleValue] = useState(field.title);
  const [editingTitle, setEditingTitle] = useState(false);

  function onFieldDelete() {
    NotalUI.Alert.close();
    workspace.field.delete({ id: field._id });
  }

  async function onFinishEditingTitle() {
    if (
      editTitleValue.length < LIMITS.MIN.WORKSPACE_FIELD_TITLE_CHARACTER_LENGTH
    ) {
      return NotalUI.Alert.show({
        title: "Error",
        desc: `Title must be atleast ${LIMITS.MIN.WORKSPACE_FIELD_TITLE_CHARACTER_LENGTH} characters long.`,
        showCloseButton: true,
        notCloseable: false,
      });
    }
    if (editTitleValue == field.title) {
      return setEditingTitle(false);
    }
    await workspace.field.edit({ id: field._id, title: editTitleValue });
    setEditingTitle(false);
  }

  async function onAddCard(card: CardTypes) {
    await workspace.card.add({ card, id: field._id });
    setAddCardModalOpen(false);
  }

  return (
    <div
      className="w-full z-20 sticky top-0 flex gap-1 items-center p-2 max-h-10 dark:bg-black/40 bg-white/40 backdrop-blur-md"
      {...props}
    >
      {!editingTitle && (
        <div className="w-6 h-6 bg-neutral-100 font-medium text-[.8em] uppercase dark:bg-neutral-900 rounded-md flex items-center justify-center">
          {field.cards?.length}
        </div>
      )}
      <div className="flex flex-row gap-1 items-center max-w-full">
        {!editingTitle && (
          <div
            className="flex font-medium uppercase break-words"
            onClick={() =>
              (workspace.isWorkspaceOwner || workspace.isWorkspaceUser) &&
              setEditingTitle(true)
            }
          >
            <span>{field.title}</span>
            {(workspace.isWorkspaceOwner || workspace.isWorkspaceUser) && (
              <div className="hidden group-hover:flex">
                <EditIcon
                  fill="currentColor"
                  style={{ transform: "scale(.65)" }}
                />
              </div>
            )}
          </div>
        )}
        {editingTitle && (
          <>
            <input
              type="text"
              className="flex p-1 rounded dark:bg-black bg-white dark:text-white text-black font-medium uppercase break-words"
              maxLength={LIMITS.MAX.WORKSPACE_FIELD_TITLE_CHARACTER_LENGTH}
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key != "Enter") return;
                onFinishEditingTitle();
              }}
            />
            <button
              onClick={() => onFinishEditingTitle()}
              title="Accept Changes"
            >
              <CheckIcon
                size={24}
                fill="currentColor"
                style={{ transform: "scale(.8)" }}
              />
            </button>
            <button
              onClick={() => setEditingTitle(false)}
              title="Discard Changes"
            >
              <CrossIcon
                size={24}
                fill="currentColor"
                style={{ transform: "scale(.8)" }}
              />
            </button>
          </>
        )}
      </div>
      {(workspace.isWorkspaceOwner || workspace.isWorkspaceUser) &&
        !editingTitle && (
          <div className="flex flex-row gap-2 absolute right-2 dark:bg-black/60 bg-neutral-200/60 backdrop-blur-lg rounded-lg">
            <div className="relative group-hover:flex sm:hidden flex">
              <Tooltip
                content={`Delete field ${field.title}`}
                outline
                direction="left"
              >
                <Button
                  light="active:opacity-50"
                  size="h-8 w-8"
                  className="p-0"
                  title={`Delete Field ${field.title}`}
                  onClick={() =>
                    field.cards.length > 0
                      ? NotalUI.Alert.show({
                          title: `Delete Field ${field.title}`,
                          titleIcon: (
                            <DeleteIcon size={24} fill="currentColor" />
                          ),
                          desc: (
                            <div className="text-center w-full">
                              Are you sure want to delete this field that has{" "}
                              {field.cards?.length}{" "}
                              {field.cards.length > 1 ? "cards" : "card"}?
                            </div>
                          ),
                          showCloseButton: false,
                          notCloseable: false,
                          buttons: [
                            <Button
                              light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
                              onClick={() => NotalUI.Alert.close()}
                              key={1}
                              fullWidth="w-[49%]"
                            >
                              <CrossIcon size={24} fill="currentColor" />
                              Cancel
                            </Button>,
                            <Button
                              onClick={() => onFieldDelete()}
                              key={2}
                              fullWidth="w-[49%]"
                            >
                              <CheckIcon size={24} fill="currentColor" />
                              Delete
                            </Button>,
                          ],
                        })
                      : onFieldDelete()
                  }
                >
                  <DeleteIcon
                    size={24}
                    className="scale-75 fill-black dark:fill-white"
                  />
                </Button>
              </Tooltip>
              {field.cards.length < LIMITS.MAX.WORKSPACE_CARD_LENGTH && (
                <Tooltip
                  content={`Add Card to ${field.title}`}
                  outline
                  direction="left"
                >
                  <Button
                    light="active:opacity-50"
                    size="h-8 w-8"
                    className="p-0"
                    onClick={() => setAddCardModalOpen(true)}
                    title={`Add Card to ${field.title}`}
                  >
                    <AddIcon
                      size={24}
                      className="scale-75 fill-black dark:fill-white"
                    />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      <AddCardModal
        open={addCardModalOpen}
        onClose={() => setAddCardModalOpen(false)}
        onAdd={(card) => onAddCard(card)}
        fieldTitle={field.title}
      />
    </div>
  );
}
