import type { CardTypes, OwnerTypes } from "@types/index";

export interface ViewCardModalProps {
  open: boolean;
  onClose: () => void;
  card: CardTypes;
  cardOwner: OwnerTypes;
}
