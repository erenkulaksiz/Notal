import { FC, ReactNode } from "react";

export interface ModalProps {
  children?: ReactNode;
  open: boolean;
  blur?: boolean;
  onClose: Function;
  className?: string;
  animate?: boolean;
  closeBtn?: boolean;
}

export interface ModalBackdropProps {
  children?: ReactNode;
  blur?: boolean;
  onClose: Function;
  open: boolean;
  setShow?: (open: boolean) => void;
  onKeyDown?: Function;
  className?: string;
}

export interface ModalContentProps {
  children?: ReactNode;
  blur?: boolean;
  animate?: boolean;
  className?: string;
}

export interface ModalBodyProps {
  children?: ReactNode;
  animate?: boolean;
  className?: string;
}

export interface ModalTitleProps {
  children?: ReactNode;
  animate?: boolean;
  className?: string;
}

export interface ModalFooterProps {
  children?: ReactNode;
  animate?: boolean;
  className?: string;
}
