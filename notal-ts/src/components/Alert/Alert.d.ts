import { ReactNode } from "react";

export interface AlertProps {
  title?: string;
  desc?: string;
  showCloseButton?: boolean;
  closeable?: boolean;
  titleIcon?: boolean;
  blur?: boolean;
  buttons?: ReactNode[] | boolean;
  animate?: boolean;
  customContent?: ReactNode | boolean;
  visible?: boolean;
  onClose?: any;
  open?: boolean;
}
