import '../../styles/globals.css';
import '../app/firebaseApp';
import { AuthProvider } from '../hooks/auth';
import { ThemeProvider } from '../hooks/theme';
import AuthStateChanged from '../layout/AuthStateChanged';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const MyApp = ({ Component, pageProps }) => {

  return (<AuthProvider>
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider>
        <AuthStateChanged>
          <Component {...pageProps} />
        </AuthStateChanged>
      </ThemeProvider>
    </DndProvider>
  </AuthProvider>)
}

export default MyApp
