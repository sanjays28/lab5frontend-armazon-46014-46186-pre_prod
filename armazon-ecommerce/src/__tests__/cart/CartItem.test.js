import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import CartItem from '../../components/CartItem/CartItem';
import { CartContext } from '../../context/CartContext';

// Create theme for testing
const theme = createTheme();

// Helper function to wait for Material-UI animations
const waitForMuiAnimation = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock data
const mockItem = {
  id: 1,
  name: 'Test Product',
  price: 19.99,
  quantity: 2,
  image: 'test-image.jpg'
};

// Mock cart context
const mockDispatch = jest.fn();
const mockCartContext = {
  state: {
    items: [mockItem],
    totalItems: 2,
    totalAmount: 39.98
  },
  dispatch: mockDispatch
};

// Wrapper component with mock context
const renderWithContext = (component) => {
  return render(
    <CartContext.Provider value={mockCartContext}>
      {component}
    </CartContext.Provider>
  );
};

describe('CartItem Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  test('Renders product information correctly', () => {
    renderWithContext(<CartItem item={mockItem} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('Total: $39.98')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });

  test('Displays correct quantity', () => {
    renderWithContext(<CartItem item={mockItem} />);
    
    const quantityButton = screen.getByRole('button', { name: '2' });
    expect(quantityButton).toBeInTheDocument();
    expect(quantityButton).toBeDisabled();
  });

  test('Handles quantity increment', () => {
    renderWithContext(<CartItem item={mockItem} />);
    
    const incrementButton = screen.getByTestId('AddIcon').closest('button');
    fireEvent.click(incrementButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_QUANTITY',
      payload: { id: 1, quantity: 3 }
    });
  });

  test('Handles quantity decrement', () => {
    renderWithContext(<CartItem item={mockItem} />);
    
    const decrementButton = screen.getByTestId('RemoveIcon').closest('button');
    fireEvent.click(decrementButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_QUANTITY',
      payload: { id: 1, quantity: 1 }
    });
  });

  test('Prevents quantity below 1', () => {
    const itemWithMinQuantity = { ...mockItem, quantity: 1 };
    renderWithContext(<CartItem item={itemWithMinQuantity} />);
    
    const decrementButton = screen.getByTestId('RemoveIcon').closest('button');
    expect(decrementButton).toBeDisabled();
  });

  test('Handles remove item action', () => {
    renderWithContext(<CartItem item={mockItem} />);
    
    const removeButton = screen.getByTestId('DeleteIcon').closest('button');
    fireEvent.click(removeButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'REMOVE_FROM_CART',
      payload: { id: 1 }
    });
  });

  test('Calculates item total correctly', () => {
    const itemWithDifferentQuantity = { ...mockItem, quantity: 3 };
    renderWithContext(<CartItem item={itemWithDifferentQuantity} />);
    
    expect(screen.getByText('Total: $59.97')).toBeInTheDocument();
  });

  test('Updates cart context on quantity change', () => {
    renderWithContext(<CartItem item={mockItem} />);
    
    const incrementButton = screen.getByTestId('AddIcon').closest('button');
    fireEvent.click(incrementButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_QUANTITY',
      payload: { id: 1, quantity: 3 }
    });
  });

  test('Updates cart context on remove', () => {
    renderWithContext(<CartItem item={mockItem} />);
    
    const removeButton = screen.getByTestId('DeleteIcon').closest('button');
    fireEvent.click(removeButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'REMOVE_FROM_CART',
      payload: { id: 1 }
    });
  });
  // Snapshot tests
  describe('CartItem Snapshots', () => {
    const renderWithTheme = async (component) => {
      let tree;
      await act(async () => {
        tree = renderer.create(
          <ThemeProvider theme={theme}>
            <CartContext.Provider value={mockCartContext}>
              {component}
            </CartContext.Provider>
          </ThemeProvider>
        );
        await waitForMuiAnimation();
      });
      return tree;
    };

    test('matches snapshot in default state', async () => {
      const tree = await renderWithTheme(<CartItem item={mockItem} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot with quantity greater than 1', async () => {
      const itemWithHighQuantity = { ...mockItem, quantity: 5 };
      const tree = await renderWithTheme(<CartItem item={itemWithHighQuantity} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot in loading state', async () => {
      const loadingItem = { ...mockItem, loading: true };
      const tree = await renderWithTheme(<CartItem item={loadingItem} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot with different screen sizes', async () => {
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
      const desktopTree = await renderWithTheme(<CartItem item={mockItem} />);
      expect(desktopTree.toJSON()).toMatchSnapshot('desktop view');

      window.matchMedia = (query) => ({
        ...mockMatchMedia(query),
        matches: false,
      });
      const mobileTree = await renderWithTheme(<CartItem item={mockItem} />);
      expect(mobileTree.toJSON()).toMatchSnapshot('mobile view');

      window.matchMedia = originalMatchMedia;
    });

    test('matches snapshot with hover state', async () => {
      const tree = await renderWithTheme(<CartItem item={mockItem} />);
      
      await act(async () => {
        const instance = tree.root;
        const cardElement = instance.findByProps({ 'data-testid': 'cart-item-card' });
        renderer.act(() => {
          cardElement.props.onMouseEnter();
        });
        await waitForMuiAnimation();
      });
      
      expect(tree.toJSON()).toMatchSnapshot('hovered state');
    });
  });
});
