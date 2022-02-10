import '../../styles/globals.css';
import '../app/firebaseApp';
import { AuthProvider } from '../hooks/auth';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProgressBar from "@badrap/bar-of-progress";
import { DragDropContext } from 'react-beautiful-dnd';

const progress = new ProgressBar({
  size: 3,
  color: "#036AE6",
  className: "progress-bar-notal",
  delay: 100,
});

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      primaryLight: '$green200',
      primaryDark: '$green600',
      gradient: 'linear-gradient(130deg, #036AE6 10%, #F1067F 160%)',
      textGradient: 'linear-gradient(110deg, #036AE6 20%, #F1067F 110%)',

      "$red900": '#ff0000',
      "$red800": '#d10808',
      "$red700": '#a30b0b',
      "$red600": '#800b0b',
      "$red500": '#690909',
      "$red400": '#570606',
      textInvert: '$black',
      textTitle: '$gray700',
    },
    space: {},
    fonts: {
      sans: "'Roboto', sans-serif;",
    },
    shadows: {
      xl: 'rgba(0, 0, 0, 0.20) 0px 22px 70px 4px'
    }
  }
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      primaryLight: '$green200',
      primaryDark: '$green600',
      gradient: 'linear-gradient(130deg, #036AE6 10%, #F1067F 160%)',
      textGradient: 'linear-gradient(110deg, #036AE6 20%, #F1067F 110%)',
      border: '$accents2',
      textInvert: '$white',
      textTitle: '$gray400',
    },
    space: {},
    fonts: {
      sans: "'Roboto', sans-serif;",
    },
    shadows: {
      xl: 'rgba(0, 0, 0, 0.20) 0px 22px 70px 4px'
    }
  }
});

export function reportWebVitals({ id, name, label, value }) {
  window.gtag('event', name, {
    event_category:
      label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  })
  if (name == "FCP" || name == "LCP") {
    console.log(name, value);
  }
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
    }
  }, [router.events])

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events]);

  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <NextUIProvider>
        <AuthProvider>
          <DragDropContext>
            <Component {...pageProps} />
          </DragDropContext>
        </AuthProvider>
      </NextUIProvider>
    </NextThemesProvider>)
}

export default Notal;
