import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import { CartProvider } from '../context/CartContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CartProvider>
          {component}
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('NavigationBar', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo and main navigation links', () => {
    renderWithProviders(<NavigationBar />);
    
    expect(screen.getByText('Armazon')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('opens and closes the category dropdown menu', async () => {
    renderWithProviders(<NavigationBar />);
    
    const categoriesButton = screen.getByText('Categories');
    fireEvent.click(categoriesButton);

    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
      expect(screen.getByText('Home & Garden')).toBeInTheDocument();
    });

    // Click outside to close menu
    fireEvent.click(document.body);
    
    await waitFor(() => {
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });
  });

  it('navigates to the correct category when selected', async () => {
    renderWithProviders(<NavigationBar />);
    
    const categoriesButton = screen.getByText('Categories');
    fireEvent.click(categoriesButton);

    const electronicsOption = await screen.findByText('Electronics');
    fireEvent.click(electronicsOption);

    expect(mockNavigate).toHaveBeenCalledWith('/category/electronics');
  });

  it('opens and closes the user menu', async () => {
    renderWithProviders(<NavigationBar />);
    
    const userButton = screen.getByLabelText('user account');
    fireEvent.click(userButton);

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    fireEvent.click(document.body);
    
    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });
  });

  it('displays cart icon with item count when cart has items', () => {
    const mockCart = {
      items: [{ id: 1 }, { id: 2 }]
    };

    jest.spyOn(require('../../hooks/useCart'), 'useCart').mockImplementation(() => ({
      cart: mockCart
    }));

    renderWithProviders(<NavigationBar />);
    
    const cartCount = screen.getByText('2');
    expect(cartCount).toBeInTheDocument();
  });

  describe('Mobile view', () => {
    beforeEach(() => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width:599.95px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));
    });

    it('renders hamburger menu in mobile view', () => {
      renderWithProviders(<NavigationBar />);
      
      expect(screen.getByLabelText('menu')).toBeInTheDocument();
    });

    it('opens and closes mobile menu', async () => {
      renderWithProviders(<NavigationBar />);
      
      const menuButton = screen.getByLabelText('menu');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getAllByText('Electronics')[0]).toBeInTheDocument();
      });

      fireEvent.click(document.body);
      
      await waitFor(() => {
        expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
      });
    });
  });
});