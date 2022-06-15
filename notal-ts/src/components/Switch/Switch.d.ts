import { ChangeEventHandler, ReactNode } from "react";

export interface SwitchProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: boolean;
  icon?: ReactNode;
  className?: string;
  id: string;
  role?: string;
}
