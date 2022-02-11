import '../../styles/tailwind.css';
import { ThemeProvider } from 'next-themes';

const Notal = ({ Component, pageProps }) => {
  return (<ThemeProvider attribute="class">
    <Component {...pageProps} />
  </ThemeProvider>)
}

export default Notal;
