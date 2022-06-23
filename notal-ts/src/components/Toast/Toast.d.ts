import { ReactNode } from "react";

export interface ToastProps {
  title?: string;
  desc?: string;
  icon?: ReactNode;
  closeable?: boolean;
  className?: string;
  buttons?: ReactNode | ReactNode[] | ((index: number) => void) | void;
  onClick?: (index?: number) => void;
  onRender?: Function;
  close?: Function;
  showClose?: boolean;
  id?: string | number;
  rendered?: boolean;
  type?: string;
  timeEnabled?: boolean;
  duration?: number;
}
