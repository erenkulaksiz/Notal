import { AddIcon } from "@icons";
import useWorkspace from "@hooks/useWorkspace";

export default function AddFieldButton() {
  const workspace = useWorkspace();

  function onFieldAdd() {
    workspace.field.add({ title: "Untitled" });
  }

  return (
    <button
      onClick={onFieldAdd}
      className="flex items-center z-20 justify-center rounded-md group h-full w-[280px] min-w-[280px] dark:bg-black/70 bg-white/70 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/40 transition-all ease-in-out"
    >
      <AddIcon
        size={24}
        fill="currentColor"
        className="hidden group-hover:flex"
      />
    </button>
  );
}
