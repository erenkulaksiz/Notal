import { AppProps } from "next/app";

export {};

declare global {
  interface Window {
    gtag: any;
  }
}

export interface RootProps extends AppProps {
  validate: {
    success: boolean;
    data: object;
  };
}
