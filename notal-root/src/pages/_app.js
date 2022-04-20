import "../../styles/tailwind.css";
import "../app/firebaseApp";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ProgressBar from "@badrap/bar-of-progress";

import { AuthProvider } from "@hooks/auth";
import { NotalUIProvider } from "@hooks/notalui";

import Log from "@utils/logger"

const progress = new ProgressBar({
  size: 3,
  color: "#036AE6",
  className: "progress-bar-notal",
  delay: 100,
});

export function reportWebVitals({ id, name, label, value }) {
  if (name == "FCP" || name == "LCP") {
    Log.debug(name, value);
  }
  if (process.env.NODE_ENV !== "production") {
    return; // don't report vitals on production
  }
  window.gtag("event", name, {
    event_category:
      label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value),
    event_label: id,
    non_interaction: true,
  });
}

const Notal = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", progress.start);
    router.events.on("routeChangeComplete", progress.finish);
    router.events.on("routeChangeError", progress.finish);
    return () => {
      router.events.off("routeChangeStart", progress.start);
      router.events.off("routeChangeComplete", progress.finish);
      router.events.off("routeChangeError", progress.finish);
    };
  }, [router.events]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <NotalUIProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </NotalUIProvider>
    </ThemeProvider>
  );
};

export default Notal;