import { useState } from "react";

import { Modal, Input, Button } from "@components";
import { AddIcon, CrossIcon, CheckIcon } from "@icons";

import type { AddFieldModalProps } from "./AddField.d";
import { LIMITS } from "@constants/limits";

export function AddFieldModal({
  open,
  onClose,
  onAdd,
  workspaceTitle,
}: AddFieldModalProps) {
  const [newField, setNewField] = useState({ title: "Untitled" });
  const [newFieldErr, setNewFieldErr] = useState<{ title: string | boolean }>({
    title: false,
  });

  function close() {
    onClose();
    setNewFieldErr({ title: false });
    setNewField({ title: "Untitled" });
  }

  function submit() {
    if (newField.title.length < LIMITS.MIN.WORKSPACE_FIELD_TITLE_CHARACTER) {
      setNewFieldErr({
        ...newFieldErr,
        title: "Field title must be minimum 2 characters.",
      });
      return;
    }
    if (newField.title.length > LIMITS.MAX.WORKSPACE_FIELD_TITLE_CHARACTER) {
      setNewFieldErr({
        ...newFieldErr,
        title: "Field title must be maximum 28 characters.",
      });
      return;
    }
    onAdd({
      ...newField,
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
      onClose={onClose}
      className="w-[90%] sm:w-[400px] p-4 px-5"
      animate
    >
      <Modal.Title animate>
        <AddIcon size={24} fill="currentColor" />
        <span className="text-lg font-medium ml-1">
          {`Add field to ${workspaceTitle}`}
        </span>
      </Modal.Title>
      <Modal.Body className="grid grid-cols-1 gap-2 pb-2" animate>
        <label htmlFor="fieldTitle">Field Title</label>
        <Input
          fullWidth
          placeholder="Field Title"
          onChange={(e) => setNewField({ ...newField, title: e.target.value })}
          value={newField.title}
          id="fieldTitle"
          maxLength={28}
          onEnterPress={() => submit()}
        />
        {newFieldErr.title != false && (
          <span className="text-red-500">{newFieldErr.title}</span>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-between" animate>
        <Button
          className="w-[49%] h-10"
          light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
          onClick={close}
          fullWidth="w-[49%]"
        >
          <CrossIcon size={24} fill="currentColor" />
          Cancel
        </Button>
        <Button className="w-[49%] h-10" onClick={submit} fullWidth="w-[49%]">
          <CheckIcon size={24} fill="currentColor" />
          Add Field
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
