import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { SWRResponse } from "swr";

import { useAuth, useNotalUI } from "@hooks";
import { WorkspaceService } from "@services";
import { Log } from "@utils";
import type { WorkspaceDataReturnType } from "@utils/api/workspaceData";
import type { CardTypes, FieldTypes } from "@types";

export interface WorkspaceContextProps {
  workspace: SWRResponse<WorkspaceDataReturnType>;
  setWorkspace: Dispatch<
    SetStateAction<SWRResponse<WorkspaceDataReturnType> | null>
  >;
  workspaceNotFound: boolean;
  isWorkspaceOwner: boolean;
  workspaceLoading: boolean;
  starWorkspace: () => Promise<void>;
  visibilityToggle: () => Promise<void>;
  deleteWorkspace: () => Promise<void>;
  field: {
    add: (title: FieldTypes) => Promise<void>;
    delete: ({ id }: { id: string }) => Promise<void>;
    edit: ({ id, title }: { id: string; title: string }) => Promise<void>;
    reorder: ({
      destination,
      source,
      fieldId,
    }: {
      destination: { droppableId: string; index: number };
      source: { droppableId: string; index: number };
      fieldId: string;
    }) => Promise<void>;
  };
  card: {
    add: ({ card, id }: { card: CardTypes; id: string }) => Promise<void>;
    delete: ({
      id,
      fieldId,
    }: {
      id?: string;
      fieldId: string;
    }) => Promise<void>;
    reorder: ({
      destination,
      source,
      cardId,
    }: {
      destination: { droppableId: string; index: number };
      source: { droppableId: string; index: number };
      cardId: string;
    }) => Promise<void>;
  };
}

const WorkspaceContext = createContext<WorkspaceContextProps>(
  {} as WorkspaceContextProps
);

export default function useWorkspace() {
  return useContext(WorkspaceContext);
}

export function WorkspaceProvider(props: PropsWithChildren) {
  const auth = useAuth();
  const NotalUI = useNotalUI();

  const [workspaceNotFound, setWorkspaceNotFound] = useState(false);
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspace, setWorkspace] =
    useState<WorkspaceContextProps["workspace"]>();

  useEffect(() => {
    if (!workspace) return;

    const notFound =
      (workspace?.data?.data?.workspaceVisible == false &&
        !auth?.validatedUser) ||
      workspace?.data?.error == "not-found" ||
      workspace?.data?.error == "invalid-params" ||
      workspace?.data?.error == "user-workspace-private" ||
      workspace?.data?.success != true;

    setWorkspaceNotFound(notFound);

    if (!notFound) {
      const isOwner =
        workspace?.data?.data?.owner?.uid == auth?.validatedUser?.uid;

      setIsWorkspaceOwner(isOwner);
    }

    Log.debug("workspace", workspace);

    if (workspace?.data?.success) {
      setWorkspaceLoading(false);
    } else {
      setWorkspaceLoading(workspace.isValidating);
    }
  }, [workspace]);

  async function starWorkspace() {
    if (!workspace?.data?.data) return;
    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          starred: !workspace.data.data.starred,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.star(
      workspace?.data?.data?._id ?? ""
    );
    Log.debug("starData:", data);
    if (data?.success) {
      window.gtag("event", "starWorkspace", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
    }
  }

  async function visibilityToggle() {
    if (!workspace?.data?.data) return;
    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          workspaceVisible: !workspace.data.data.workspaceVisible,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.toggleVisibility(
      workspace?.data?.data?._id ?? ""
    );
    Log.debug("toggleVisibility data:", data);
    if (data?.success) {
      window.gtag("event", "toggleVisibility", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
    }
  }

  async function deleteWorkspace() {
    if (!workspace?.data?.data) return;
    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          workspaceVisible: !workspace.data.data.workspaceVisible,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.delete(
      workspace?.data?.data?._id ?? ""
    );
    Log.debug("deleteWorkspace data:", data);
    if (data?.success) {
      window.gtag("event", "deleteWorkspace", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
    }
  }

  async function addField({ title }: { title: string }) {
    if (!workspace?.data?.data) return;

    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          fields: [
            ...workspace?.data?.data?.fields,
            {
              _id: Date.now().toString(),
              title,
              updatedAt: Date.now(),
              createdAt: Date.now(),
              owner: "",
              cards: [],
            },
          ],
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.field.add({
      title,
      id: workspace?.data?.data?._id,
    });

    Log.debug("addField data:", data);
    if (data?.success) {
      window.gtag("event", "addField", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
      workspace?.mutate();
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
    }
  }

  async function deleteField({ id }: { id: string }) {
    if (!workspace?.data?.data) return;

    const newFields = workspace?.data?.data?.fields;
    newFields.splice(
      workspace?.data?.data?.fields.findIndex((el: FieldTypes) => el._id == id),
      1
    );
    workspace?.mutate(
      {
        ...workspace.data,
        data: { ...workspace.data.data, fields: newFields },
      },
      false
    );

    const data = await WorkspaceService.workspace.field.delete({
      id,
      workspaceId: workspace?.data?.data?._id,
    });

    Log.debug("deleteField data:", data);
    if (data?.success) {
      window.gtag("event", "deleteField", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
      workspace?.mutate();
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
    }
  }

  async function editField({ title, id }: { title: string; id: string }) {
    if (!workspace?.data?.data) return;

    const editFieldIndex = workspace?.data?.data?.fields.findIndex(
      (field: FieldTypes) => field._id == id
    );
    let newFields = workspace?.data?.data?.fields;
    let newField = newFields[editFieldIndex];
    newField = {
      ...newField,
      title,
    };
    newFields[editFieldIndex] = newField;

    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          fields: [...newFields],
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.field.edit({
      title,
      id,
      workspaceId: workspace?.data?.data?._id,
    });

    Log.debug("editField data:", data);
    if (data?.success) {
      window.gtag("event", "editField", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
      workspace?.mutate();
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
    }
  }

  async function addCard({ card, id }: { card: CardTypes; id: string }) {
    if (!workspace?.data?.data) return;

    const addCardFieldIndex = workspace?.data?.data?.fields.findIndex(
      (field: FieldTypes) => field._id == id
    );
    let newFields = workspace?.data?.data?.fields;
    let newField = newFields[addCardFieldIndex];
    newField = {
      ...newField,
      cards: [...newField.cards, { ...card, _id: Date.now().toString() }],
    };
    newFields[addCardFieldIndex] = newField;

    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          fields: [...newFields],
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.card.add({
      card,
      workspaceId: workspace?.data?.data?._id,
      id,
    });

    Log.debug("addCard data:", data);
    if (data?.success) {
      window.gtag("event", "addCard", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
      workspace?.mutate();
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
    }
  }

  async function deleteCard({ id, fieldId }: { id: string; fieldId: string }) {
    if (!workspace?.data?.data) return;

    const newFields = workspace?.data?.data?.fields;
    const field = workspace?.data?.data?.fields.findIndex(
      (el: FieldTypes) => el._id == fieldId
    );
    const card = newFields[field].cards.findIndex(
      (el: CardTypes) => el._id == id
    );

    newFields[field].cards.splice(card, 1);

    workspace?.mutate(
      {
        ...workspace.data,
        data: { ...workspace?.data?.data, fields: newFields },
      },
      false
    );

    const data = await WorkspaceService.workspace.card.delete({
      id,
      workspaceId: workspace?.data?.data?._id,
      fieldId,
    });

    Log.debug("deleteCard data:", data);
    if (data?.success) {
      window.gtag("event", "deleteCard", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
      workspace?.mutate();
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      //workspace?.mutate();
    }
  }

  async function reorderField({
    destination,
    source,
    fieldId,
  }: {
    destination: { droppableId: string; index: number };
    source: { droppableId: string; index: number };
    fieldId: string;
  }) {
    if (!workspace?.data?.data) return;

    const newFields = [...workspace?.data?.data?.fields];
    const [copy] = newFields.splice(source.index, 1);
    newFields.splice(destination.index, 0, copy);

    workspace.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          fields: newFields,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.field.reorder({
      id: workspace?.data?.data?._id,
      fieldId,
      destination,
      source,
    });

    Log.debug("reorderField data:", data);
    if (data?.success) {
      window.gtag("event", "reorderField", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
      //workspace.mutate();
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
    }
  }

  async function reorderCard({
    destination,
    source,
    cardId,
  }: {
    destination: { droppableId: string; index: number };
    source: { droppableId: string; index: number };
    fieldId: string;
    cardId: string;
  }) {
    if (!workspace?.data?.data) return;

    const newFields = [...workspace?.data?.data?.fields];
    const sourceField = newFields.findIndex(
      (el: FieldTypes) => el._id == source.droppableId
    );
    const [copy] = newFields[sourceField].cards.splice(source.index, 1);
    const destinationField = newFields.findIndex(
      (el: FieldTypes) => el._id == destination.droppableId
    );
    newFields[destinationField].cards.splice(destination.index, 0, copy);

    workspace.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          fields: newFields,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.card.reorder({
      id: workspace?.data?.data?._id,
      cardId,
      destination,
      source,
    });

    Log.debug("reorderCard data:", data);
    if (data?.success) {
      window.gtag("event", "reorderCard", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
      //workspace.mutate();
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
    }
  }

  const value = {
    workspace,
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
    setWorkspace,
    workspaceNotFound,
    workspaceLoading,
    isWorkspaceOwner,
    starWorkspace,
    deleteWorkspace,
    visibilityToggle,
  } as WorkspaceContextProps;

  return <WorkspaceContext.Provider value={value} {...props} />;
}
