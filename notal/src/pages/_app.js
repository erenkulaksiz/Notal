import '../../styles/globals.css';
import '../app/firebaseApp';
import { AuthProvider } from '../hooks/auth';
import { ThemeProvider } from '../hooks/theme';
import AuthStateChanged from '../layout/AuthStateChanged';

const MyApp = ({ Component, pageProps }) => {

  return (<AuthProvider>
    <ThemeProvider>
      <AuthStateChanged>
        <Component {...pageProps} />
      </AuthStateChanged>
    </ThemeProvider>
  </AuthProvider>)
}

export default MyApp
