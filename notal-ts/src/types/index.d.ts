import { PropsWithChildren } from "react";

export {};

declare global {
  interface Window {
    gtag: any;
    workbox: any;
  }
}

export interface NotalRootProps extends PropsWithChildren {
  validate?: {
    success: boolean;
    data: object;
    error?: string | object;
  };
  workspace?: {
    success: boolean;
    data: WorkspaceTypes;
    error?: string | object;
  };
  withoutLayout?: boolean;
}

export interface WorkspaceTypes {
  _id: string;
  id: string;
  createdAt: number;
  desc?: string;
  title: string;
  owner?: {
    avatar: string;
    fullname: string;
    username: string;
    uid: string;
  };
  starred: boolean;
  updatedAt: number;
  workspaceVisible: boolean;
  thumbnail: {
    type: "image" | "singleColor" | "gradient" | string;
    file?: string | ArrayBuffer | null;
    fileData?: File | null;
    color?: string;
    colors?: {
      start?: string;
      end?: string;
    };
  };
}

export declare module WorkboxWindow {
  class Workbox {
    constructor(scriptURL: string, registerOptions?: object);

    register(immediate?: boolean): Promise<any>;
    active(): Promise<ServiceWorker>;
    controlling(): Promise<ServiceWorker>;
    getSW(): Promise<ServiceWorker>;
    messageSW(data: object): Promise<object>;

    addEventListener(
      event: "message",
      callback: (data: IWorkboxEventMessage) => void
    ): void;
    addEventListener(
      event: "installed",
      callback: (data: IWorkboxEvent) => void
    ): void;
    addEventListener(
      event: "waiting",
      callback: (data: IWorkboxEventWaiting) => void
    ): void;
    addEventListener(
      event: "controlling",
      callback: (data: IWorkboxEvent) => void
    ): void;
    addEventListener(
      event: "activated",
      callback: (data: IWorkboxEvent) => void
    ): void;
    addEventListener(
      event: "redundant",
      callback: (data: IWorkboxEvent) => void
    ): void;
    addEventListener(
      event: "externalinstalled",
      callback: (data: IWorkboxEventExternal) => void
    ): void;
    addEventListener(
      event: "externalwaiting",
      callback: (data: IWorkboxEventExternal) => void
    ): void;
    addEventListener(
      event: "externalactivated",
      callback: (data: IWorkboxEventExternal) => void
    ): void;
  }

  type WorkboxEvent =
    | "message"
    | "installed"
    | "waiting"
    | "controlling"
    | "activated"
    | "redundant"
    | "externalinstalled"
    | "externalwaiting"
    | "externalactivated"
    | "wasWaitingBeforeRegister"
    | any;

  interface IWorkboxEventBase {
    originalEvent: Event;
    type: WorkboxEvent;
    target: Workbox;
  }

  interface IWorkboxEventMessage extends IWorkboxEventBase {
    data: any;
  }

  interface IWorkboxEvent extends IWorkboxEventBase {
    sw: ServiceWorker;
    isUpdate: boolean | undefined;
  }

  interface IWorkboxEventWaiting extends IWorkboxEvent {
    wasWaitingBeforeRegister: boolean | undefined;
  }

  interface IWorkboxEventExternal extends IWorkboxEventBase {
    sw: ServiceWorker;
  }
}
