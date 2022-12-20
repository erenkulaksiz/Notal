import { ObjectId } from "mongodb";
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
    data: {
      avatar: string;
      email: string;
      fullname?: string;
      uid: string;
      username: string;
      onboarding?: {
        completed: boolean;
        date?: number;
      };
    };
    error?: string | object;
  };
  workspace?: {
    success: boolean;
    data: WorkspaceTypes;
    error?: string | object;
  };
  withoutLayout?: boolean;
}

export interface CardTypes {
  color?: string;
  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
  title?: string;
  desc?: string;
  tags?: [];
  image?: {
    url?: string; // file url
  };
}

export interface FieldTypes {
  collapsed?: boolean;
  createdAt?: number;
  updatedAt?: number;
  _id?: string | ObjectId;
  owner?: string;
  title?: string;
  cards?: Array[CardTypes];
}

export interface ThumbnailTypes {
  type: "image" | "singleColor" | "gradient" | string;
  file?: string | ArrayBuffer | null;
  fileData?: File | null;
  color?: string;
  colors?: {
    start?: string;
    end?: string;
  };
}

export interface OwnerTypes {
  avatar: string;
  fullname: string;
  username: string;
  uid: string;
}

export interface WorkspaceTypes {
  _id: string;
  id: string;
  createdAt: number;
  desc?: string;
  title: string;
  owner?: OwnerTypes;
  starred: boolean;
  updatedAt: number;
  workspaceVisible: boolean;
  thumbnail: ThumbnailTypes;
  fields?: Array[FieldTypes];
  users?: {
    [key: string]: Array[OwnerTypes];
  };
}

export interface PlatformLogin {
  icon: ReactNode;
  text: string;
  id: string;
}

export interface PlatformLoginTypes {
  google: PlatformLogin;
  github: PlatformLogin;
  email: PlatformLogin;
}

export interface PlatformLogins {
  google: () => void;
  github: () => void;
  email: () => void;
}

/*
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
*/
