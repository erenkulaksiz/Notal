import { DragIcon } from "@icons";
import { Button } from "@components";
import type { WorkspaceTypes } from "@types";

export function WorkspaceFieldHeader({
  field,
}: {
  field: WorkspaceTypes["fields"];
}) {
  return (
    <div className="w-full sticky top-0 flex items-center p-2 break-all font-medium uppercase">
      <div className="w-6 h-6 mr-2 bg-neutral-300 dark:bg-neutral-800 rounded-md flex items-center justify-center">
        {field.cards?.length}
      </div>
      <div className="w-full">{field.title}</div>
      <Button light size="h-8 w-10" className="p-0">
        <DragIcon size={24} className="scale-75 fill-black dark:fill-white" />
      </Button>
    </div>
  );
}
