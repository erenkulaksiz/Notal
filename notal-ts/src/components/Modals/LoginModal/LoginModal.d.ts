import { ReactNode } from "react";

export interface LoginModalProps {
  open: boolean;
  onClose: Function;
  onLoginSuccess: Function;
}
