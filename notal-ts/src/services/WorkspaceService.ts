import { CardTypes, WorkspaceTypes } from "@types";
import {
  addWorkspace,
  starWorkspace,
  deleteWorkspace,
  toggleVisibility,
  uploadThumbnail,
  addField,
  deleteField,
  editField,
  addCard,
  deleteCard,
  reorderField,
  reorderCard,
} from "./workspace";
import type { AddFieldParams } from "./workspace/field/addField";
import type { EditFieldParams } from "./workspace/field/editField";

interface ReturnType {
  success: boolean;
  error?: string;
}

interface WorkspaceServiceTypes {
  workspace: {
    add: (workspace: WorkspaceTypes) => Promise<ReturnType>;
    star: (id: string) => Promise<ReturnType>;
    delete: (id: string) => Promise<ReturnType>;
    toggleVisibility: (id: string) => Promise<ReturnType>;
    uploadThumbnail: ({
      image,
    }: {
      image: File;
    }) => Promise<{ success: boolean; error?: string; url?: string }>;
    field: {
      add: (field: AddFieldParams) => Promise<ReturnType>;
      delete: ({
        id,
        workspaceId,
      }: {
        id: string;
        workspaceId: string;
      }) => Promise<ReturnType>;
      edit: ({
        id,
        workspaceId,
        title,
      }: EditFieldParams) => Promise<ReturnType>;
      reorder: ({
        destination,
        source,
        fieldId,
        id,
      }: {
        destination: { droppableId: string; index: number };
        source: { droppableId: string; index: number };
        fieldId: string;
        id: string; // workspace id
      }) => Promise<ReturnType>;
    };
    card: {
      add: ({
        card,
        id,
        workspaceId,
      }: {
        card: CardTypes;
        id: string;
        workspaceId: string;
      }) => Promise<ReturnType>;
      delete: ({
        id,
        fieldId,
        workspaceId,
      }: {
        id: string;
        fieldId: string;
        workspaceId: string;
      }) => Promise<ReturnType>;
      reorder: ({
        id,
        destination,
        source,
        cardId,
      }: {
        id: string;
        destination: { droppableId: string; index: number };
        source: { droppableId: string; index: number };
        cardId: string;
      }) => Promise<ReturnType>;
    };
  };
}

export const WorkspaceService = {
  workspace: {
    add: addWorkspace,
    star: starWorkspace,
    delete: deleteWorkspace,
    toggleVisibility,
    uploadThumbnail,
    field: {
      add: addField,
      delete: deleteField,
      edit: editField,
      reorder: reorderField,
    },
    card: {
      add: addCard,
      delete: deleteCard,
      reorder: reorderCard,
    },
  },
} as WorkspaceServiceTypes;
