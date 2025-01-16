import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { CartProvider } from './context/CartContext';
import theme from './theme/theme';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Footer from './components/Footer/Footer';
import ProductDetailPage from './pages/ProductDetailPage';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavigationBar />
          <Box component="main" sx={{ flexGrow: 1, mt: 8, p: 3 }}>
            <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
