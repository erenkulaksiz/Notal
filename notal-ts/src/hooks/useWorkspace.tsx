import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { SWRResponse } from "swr";
import Pusher from "@lib/pusherClient";

import { useAuth, useNotalUI } from "@hooks";
import { WorkspaceService } from "@services";
import { Log } from "@utils";
import type { WorkspaceDataReturnType } from "@utils/api/workspaceData";
import type { CardTypes, FieldTypes, OwnerTypes } from "@types";

export interface WorkspaceContextProps {
  workspace: SWRResponse<WorkspaceDataReturnType>;
  setWorkspace: Dispatch<
    SetStateAction<SWRResponse<WorkspaceDataReturnType> | null>
  >;
  workspaceNotFound: boolean;
  isWorkspaceOwner: boolean;
  workspaceLoading: boolean;
  starWorkspace: () => Promise<WorkspaceFunctionReturnType>;
  visibilityToggle: () => Promise<WorkspaceFunctionReturnType>;
  deleteWorkspace: () => Promise<WorkspaceFunctionReturnType>;
  field: {
    add: (title: FieldTypes) => Promise<WorkspaceFunctionReturnType>;
    delete: ({ id }: { id: string }) => Promise<WorkspaceFunctionReturnType>;
    edit: ({
      id,
      title,
    }: {
      id: string;
      title: string;
    }) => Promise<WorkspaceFunctionReturnType>;
    reorder: ({
      destination,
      source,
      fieldId,
    }: {
      destination: { droppableId: string; index: number };
      source: { droppableId: string; index: number };
      fieldId: string;
    }) => Promise<WorkspaceFunctionReturnType>;
  };
  card: {
    add: ({
      card,
      id,
    }: {
      card: CardTypes;
      id: string;
    }) => Promise<WorkspaceFunctionReturnType>;
    delete: ({
      id,
      fieldId,
    }: {
      id?: string;
      fieldId: string;
    }) => Promise<WorkspaceFunctionReturnType>;
    reorder: ({
      destination,
      source,
      cardId,
    }: {
      destination: { droppableId: string; index: number };
      source: { droppableId: string; index: number };
      cardId: string;
    }) => Promise<WorkspaceFunctionReturnType>;
  };
  refreshWorkspace: () => void;
}

export interface WorkspaceFunctionReturnType {
  success?: boolean;
  error?: string;
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

  function refreshWorkspace() {
    workspace?.mutate();
  }

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
      if (!workspace?.data?.data?.users) return;

      const isOwner =
        Object.keys(workspace?.data?.data?.users).findIndex(
          (uid: string) => uid == auth?.validatedUser?.uid
        ) == -1
          ? false
          : true;

      setIsWorkspaceOwner(isOwner);
    }

    if (workspace?.data?.success) {
      setWorkspaceLoading(false);
    } else {
      setWorkspaceLoading(workspace.isValidating);
    }
  }, [workspace]);

  useEffect(() => {
    //Pusher?.unsubscribe(`notal-workspace-${workspace?.data?.data?._id}`);

    if (!workspace?.data?.data) return;
    if (workspaceLoading) return;

    const channel = Pusher?.subscribe(
      `notal-workspace-${workspace?.data?.data?._id}`
    );

    channel?.bind("workspace-updated", function (data: any) {
      Log.debug(
        `notal-workspace-${workspace?.data?.data?._id}`,
        data,
        "sendTime:",
        data.sendTime
      );
      if (data.sender == auth?.validatedUser?.uid) return; // Sender is self
      if (data.workspaceId != workspace?.data?.data?._id) return;
      refreshWorkspace();
    });
  }, [workspace?.data?.data]);

  async function starWorkspace(): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };
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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
    }
  }

  async function visibilityToggle(): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };
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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
    }
  }

  async function deleteWorkspace(): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };
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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
    }
  }

  async function addField({
    title,
  }: {
    title: string;
  }): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };

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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
    }
  }

  async function deleteField({
    id,
  }: {
    id: string;
  }): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };

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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
    }
  }

  async function editField({
    title,
    id,
  }: {
    title: string;
    id: string;
  }): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };

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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
    }
  }

  async function addCard({
    card,
    id,
  }: {
    card: CardTypes;
    id: string;
  }): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };

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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
    }
  }

  async function deleteCard({
    id,
    fieldId,
  }: {
    id: string;
    fieldId: string;
  }): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };

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
      //workspace?.mutate();
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      workspace?.mutate();
      return { success: false, error: data?.error };
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
  }): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };

    const newFields = [...workspace?.data?.data?.fields];
    //const [copy] = newFields.splice(source.index, 1);
    // get copy
    const copy = newFields[source.index];
    // remove from old position
    newFields.splice(source.index, 1);
    // insert into new position
    newFields.splice(destination.index, 0, copy);

    workspace?.mutate(
      {
        ...workspace.data,
        data: { ...workspace?.data?.data, fields: newFields },
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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      return { success: false, error: data?.error };
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
  }): Promise<WorkspaceFunctionReturnType> {
    if (!workspace?.data?.data)
      return { success: false, error: "no-workspace" };

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
      return { success: true };
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
        showCloseButton: true,
        notCloseable: false,
      });
      return { success: false, error: data?.error };
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
    refreshWorkspace,
  } as WorkspaceContextProps;

  return <WorkspaceContext.Provider value={value} {...props} />;
}
