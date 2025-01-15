import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './context/CartContext';
import theme from './theme/theme';
import { APP_NAME } from './utils/constants';
import ProductDetailPage from './pages/ProductDetailPage';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
        <div className="App">
          <h1>{APP_NAME}</h1>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
