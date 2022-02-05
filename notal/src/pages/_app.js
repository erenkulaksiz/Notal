import { useEffect } from 'react';
import '../../styles/globals.css';
import '../app/firebaseApp';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { AuthProvider } from '../hooks/auth';
import AuthStateChanged from '../layout/AuthStateChanged';
import { useRouter } from 'next/router';

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
    },
    space: {},
    fonts: {},
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
    },
    space: {},
    fonts: {},
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

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

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
      <NextUIProvider>
        <AuthProvider>
          <AuthStateChanged>
            <Component {...pageProps} />
          </AuthStateChanged>
        </AuthProvider>
      </NextUIProvider>
    </NextThemesProvider>)
}

export default MyApp
