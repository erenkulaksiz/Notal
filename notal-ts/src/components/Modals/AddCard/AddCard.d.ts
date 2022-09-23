import { CardTypes } from "@types";
import { ReactNode } from "react";

export interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (card: CardTypes) => void;
}
