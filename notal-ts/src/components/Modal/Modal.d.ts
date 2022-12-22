import { FC, ReactNode, MouseEvent } from "react";

export interface ModalProps {
  children?: ReactNode;
  open: boolean;
  blur?: boolean;
  onClose: (event?: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  className?: string;
  animate?: boolean;
  closeBtn?: boolean;
}

export interface ModalBackdropProps {
  children?: ReactNode;
  blur?: boolean;
  onClose: (event: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  open: boolean;
  setShow?: (open: boolean) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
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
