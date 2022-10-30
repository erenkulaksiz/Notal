import type { FieldTypes } from "@types";

export interface AddFieldModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (field: FieldTypes) => void;
    workspaceTitle?: string;
  }
  