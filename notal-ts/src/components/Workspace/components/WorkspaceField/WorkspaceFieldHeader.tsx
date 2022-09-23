import { useState } from "react";

import { AddIcon, DragIcon } from "@icons";
import { Button, Tooltip, AddCardModal } from "@components";
import type { WorkspaceTypes } from "@types";

export function WorkspaceFieldHeader({
  field,
}: {
  field: WorkspaceTypes["fields"];
}) {
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  return (
    <div className="w-full z-20 sticky top-0 flex items-center p-2 break-all">
      <div className="w-8 h-6 mr-2 bg-neutral-300 font-medium text-[.8em] uppercase dark:bg-neutral-800 rounded-md flex items-center justify-center">
        {field.cards?.length}
      </div>
      <div className="w-full font-medium uppercase">{field.title}</div>
      <Tooltip
        content={`Add Card to ${field.title}`}
        outline
        direction="bottom"
      >
        <Button
          light="active:opacity-50"
          size="h-8 w-10"
          className="p-0"
          onClick={() => setAddCardModalOpen(true)}
        >
          <AddIcon size={24} className="scale-75 fill-black dark:fill-white" />
        </Button>
      </Tooltip>
      <Button light size="h-8 w-10" className="p-0">
        <DragIcon size={24} className="scale-75 fill-black dark:fill-white" />
      </Button>
      <AddCardModal
        open={addCardModalOpen}
        onClose={() => setAddCardModalOpen(false)}
        onAdd={() => {}}
      />
    </div>
  );
}
