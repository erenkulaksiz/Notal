import "../../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ProgressBar from "@badrap/bar-of-progress";

import type { AppProps, NextWebVitalsMetric } from "next/app";

import { Log } from "@utils/logger";

const progress = new ProgressBar({
  size: 3,
  color: "#036AE6",
  className: "progress-bar-notal",
  delay: 100,
});

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  if (name == "FCP" || name == "LCP") {
    Log.debug(name, value);
  }
  if (process.env.NODE_ENV !== "production") {
    return; // don't report vitals on development
  }
  window.gtag("event", name, {
    event_category:
      label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value),
    event_label: id,
    non_interaction: true,
  });
}

function Notal({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const handleChangeComplete = (url: string) => {
    progress.finish();
    window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    });
  };

  useEffect(() => {
    router.events.on("routeChangeStart", progress.start);
    router.events.on("routeChangeComplete", handleChangeComplete);
    router.events.on("routeChangeError", progress.finish);
    return () => {
      router.events.off("routeChangeStart", progress.start);
      router.events.off("routeChangeComplete", handleChangeComplete);
      router.events.off("routeChangeError", progress.finish);
    };
  }, [router.events]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default Notal;
