import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from '../context/CartContext';
import theme from '../theme/theme';
import { APP_NAME } from '../utils/constants';
import '../App.css';

// PUBLIC_INTERFACE
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <div className="App">
          <h1>{APP_NAME}</h1>
          <Component {...pageProps} />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default MyApp;