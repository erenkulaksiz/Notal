import { ReactNode } from "react";

export interface AlertProps {
  title?: string | ReactNode;
  desc?: string | ReactNode;
  showCloseButton?: boolean;
  notCloseable?: boolean;
  titleIcon?: ReactNode | boolean;
  blur?: boolean;
  buttons?: ReactNode[] | boolean;
  animate?: boolean;
  customContent?: ReactNode | boolean;
  visible?: boolean;
  onClose?: any;
  open?: boolean;
  className?: string;
}
