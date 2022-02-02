import '../../styles/globals.css';
import '../app/firebaseApp';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { AuthProvider } from '../hooks/auth';
import AuthStateChanged from '../layout/AuthStateChanged';

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      primaryLight: '$green200',
      primaryDark: '$green600',
      gradient: 'linear-gradient(112deg, rgba(209,0,255,1) -20%, rgba(0,159,220,1) 100%)',
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
      gradient: 'linear-gradient(112deg, $purple400 -25%, $pink500 -10%, $purple500 80%)',
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
}

const MyApp = ({ Component, pageProps }) => {

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
