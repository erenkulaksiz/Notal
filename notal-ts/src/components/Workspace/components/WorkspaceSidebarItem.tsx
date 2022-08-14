import { Tooltip, Button } from "@components";
import { ReactNode } from "react";

interface WorkspaceSidebarItemProps {
  icon: ReactNode;
  title: string;
}

export function WorkspaceSidebarItem({
  icon,
  title,
}: WorkspaceSidebarItemProps) {
  return (
    <Tooltip
      content={title}
      direction="right"
      containerClassName="justify-center items-center"
      allContainerClassName="mb-2 w-10"
    >
      <Button
        className="justify-center"
        size="h-10"
        rounded="rounded-md"
        light="outline-none focus:outline-2 bg-neutral-100 dark:bg-neutral-800 backdrop-blur-sm"
        title={title}
        aria-label={title}
      >
        {icon}
      </Button>
    </Tooltip>
  );
}
