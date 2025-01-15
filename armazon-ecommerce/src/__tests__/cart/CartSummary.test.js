import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import CartSummary from '../../components/CartSummary/CartSummary';
import { CartContext } from '../../context/CartContext';

// Create theme for testing
const theme = createTheme();

// Helper function to wait for Material-UI animations
const waitForMuiAnimation = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock console.log to test checkout functionality
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('CartSummary Component', () => {
  const mockDispatch = jest.fn();
  
  const renderWithCartContext = (cartState) => {
    return render(
      <CartContext.Provider value={{ state: cartState, dispatch: mockDispatch }}>
        <CartSummary />
      </CartContext.Provider>
    );
  };

  beforeEach(() => {
    mockDispatch.mockClear();
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('renders cart summary with empty cart', () => {
    const emptyCartState = {
      items: [],
      totalItems: 0,
      totalAmount: 0,
    };

    renderWithCartContext(emptyCartState);

    expect(screen.getByText('Cart Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Items:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Total Amount:')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).toBeDisabled();
  });

  it('renders cart summary with items correctly', () => {
    const cartState = {
      items: [
        { id: 1, name: 'Test Product', price: 10.99, quantity: 2 },
        { id: 2, name: 'Another Product', price: 15.99, quantity: 1 },
      ],
      totalItems: 3,
      totalAmount: 37.97,
    };

    renderWithCartContext(cartState);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('$37.97')).toBeInTheDocument();
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    expect(checkoutButton).toBeEnabled();
  });

  it('handles checkout button click correctly', () => {
    const cartState = {
      items: [{ id: 1, name: 'Test Product', price: 10.99, quantity: 1 }],
      totalItems: 1,
      totalAmount: 10.99,
    };

    renderWithCartContext(cartState);

    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);

    expect(mockConsoleLog).toHaveBeenCalledWith('Proceeding to checkout...');
  });

  it('formats total amount with two decimal places', () => {
    const cartState = {
      items: [{ id: 1, name: 'Test Product', price: 10.999, quantity: 1 }],
      totalItems: 1,
      totalAmount: 10.999,
    };

    renderWithCartContext(cartState);
    expect(screen.getByText('$11.00')).toBeInTheDocument();
  });
  
  // Snapshot tests
  describe('CartSummary Snapshots', () => {
    const renderWithTheme = async (component) => {
      let tree;
      await act(async () => {
        tree = renderer.create(
          <ThemeProvider theme={theme}>
            {component}
          </ThemeProvider>
        );
        await waitForMuiAnimation();
      });
      return tree;
    };

    test('matches snapshot with empty cart', async () => {
      const emptyCartState = {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
      
      const tree = await renderWithTheme(
        <CartContext.Provider value={{ state: emptyCartState, dispatch: mockDispatch }}>
          <CartSummary />
        </CartContext.Provider>
      );
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot with items in cart', async () => {
      const cartState = {
        items: [
          { id: 1, name: 'Test Product', price: 10.99, quantity: 2 },
          { id: 2, name: 'Another Product', price: 15.99, quantity: 1 },
        ],
        totalItems: 3,
        totalAmount: 37.97,
      };
      
      const tree = await renderWithTheme(
        <CartContext.Provider value={{ state: cartState, dispatch: mockDispatch }}>
          <CartSummary />
        </CartContext.Provider>
      );
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot with checkout disabled', async () => {
      const emptyCartState = {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
      
      const tree = await renderWithTheme(
        <CartContext.Provider value={{ state: emptyCartState, dispatch: mockDispatch }}>
          <CartSummary />
        </CartContext.Provider>
      );
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot with different screen sizes', async () => {
      const cartState = {
        items: [
          { id: 1, name: 'Test Product', price: 10.99, quantity: 2 },
          { id: 2, name: 'Another Product', price: 15.99, quantity: 1 },
        ],
        totalItems: 3,
        totalAmount: 37.97,
      };

      const originalMatchMedia = window.matchMedia;
      const mockMatchMedia = (query) => ({
        matches: query === '(min-width: 600px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      });

      window.matchMedia = mockMatchMedia;
      const desktopTree = await renderWithTheme(
        <CartContext.Provider value={{ state: cartState, dispatch: mockDispatch }}>
          <CartSummary />
        </CartContext.Provider>
      );
      expect(desktopTree.toJSON()).toMatchSnapshot('desktop view');

      window.matchMedia = (query) => ({
        ...mockMatchMedia(query),
        matches: false,
      });
      const mobileTree = await renderWithTheme(
        <CartContext.Provider value={{ state: cartState, dispatch: mockDispatch }}>
          <CartSummary />
        </CartContext.Provider>
      );
      expect(mobileTree.toJSON()).toMatchSnapshot('mobile view');

      window.matchMedia = originalMatchMedia;
    });

    test('matches snapshot with hover state on checkout button', async () => {
      const cartState = {
        items: [{ id: 1, name: 'Test Product', price: 10.99, quantity: 1 }],
        totalItems: 1,
        totalAmount: 10.99,
      };

      const tree = await renderWithTheme(
        <CartContext.Provider value={{ state: cartState, dispatch: mockDispatch }}>
          <CartSummary />
        </CartContext.Provider>
      );
      
      await act(async () => {
        const instance = tree.root;
        const checkoutButton = instance.findByProps({ 'data-testid': 'checkout-button' });
        renderer.act(() => {
          checkoutButton.props.onMouseEnter();
        });
        await waitForMuiAnimation();
      });
      
      expect(tree.toJSON()).toMatchSnapshot('checkout button hovered');
    });

    test('matches snapshot with loading state during checkout', async () => {
      const cartState = {
        items: [{ id: 1, name: 'Test Product', price: 10.99, quantity: 1 }],
        totalItems: 1,
        totalAmount: 10.99,
        isCheckingOut: true,
      };

      const tree = await renderWithTheme(
        <CartContext.Provider value={{ state: cartState, dispatch: mockDispatch }}>
          <CartSummary />
        </CartContext.Provider>
      );
      expect(tree.toJSON()).toMatchSnapshot('checkout loading state');
    });
  });
});
