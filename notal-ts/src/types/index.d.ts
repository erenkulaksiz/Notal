import { PropsWithChildren } from "react";

export {};

declare global {
  interface Window {
    gtag: any;
  }
}

export interface NotalRootProps extends PropsWithChildren {
  validate: {
    success: boolean;
    data: object;
    error?: string;
  };
}
