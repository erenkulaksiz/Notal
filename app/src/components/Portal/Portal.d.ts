import { ReactNode } from "react";

export interface PortalProps {
  children?: ReactNode;
  parent?: Document | null;
  className?: string;
  portalName?: string;
}
