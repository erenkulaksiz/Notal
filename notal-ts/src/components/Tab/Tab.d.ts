import { ReactNode } from "react";

export interface TabProps {
  children?: ReactNode;
  selected: number; // index of selected tab
  onSelect: (index: number) => void; // callback when tab is selected
  headerClassName?: string; // classname for header
  loadingWorkspace?: boolean; // boolean to show loading indicator
  id: string; // id of tab
  className?: string; // classname for tab
  headerContainerClassName?: string; // classname for header container
  globalTabViewClassName?: string;
  headerVisible?: boolean;
  animated?: boolean;
  animatedTabViewClassName?: string;
}
