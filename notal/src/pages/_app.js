import '../../styles/globals.css';
import '../app/firebaseApp';
import { AuthProvider } from '../hooks/auth';
import AuthStateChanged from '../layout/AuthStateChanged';

const MyApp = ({ Component, pageProps }) => {

  return (<AuthProvider>
    <AuthStateChanged>
      <Component {...pageProps} />
    </AuthStateChanged>
  </AuthProvider>)
}

export default MyApp
