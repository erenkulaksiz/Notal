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
    fonts: {}
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      primaryLight: '$green200',
      primaryDark: '$green600',
      gradient: 'linear-gradient(112deg, $purple400 -25%, $pink500 -10%, $purple500 80%)',
    },
    space: {},
    fonts: {}
  }
})

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
