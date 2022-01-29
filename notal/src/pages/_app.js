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
      primaryDark: '$green600'
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
      primaryDark: '$green600'
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
