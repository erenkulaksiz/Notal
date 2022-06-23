import { PropsWithChildren } from "react";

export {};

declare global {
  interface Window {
    gtag: any;
  }
}

export interface NotalRootProps extends PropsWithChildren {
  validate?: {
    success: boolean;
    data: object;
    error?: string;
  };
  withoutLayout?: boolean;
}

export interface WorkspaceTypes {
  _id: string;
  id: string;
  createdAt: number;
  desc?: string;
  title: string;
  owner: string;
  starred: boolean;
  updatedAt: number;
  workspaceVisible: boolean;
  thumbnail: {
    type: "image" | "singleColor" | "gradient";
    file?: string;
    color?: string;
    colors?: {
      start?: string;
      end?: string;
    };
  };
}
