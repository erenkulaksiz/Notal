import { ReactNode } from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  children?: ReactNode;
  id: string;
}
