import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from '../../components/ProductList/ProductList';
import CartItem from '../../components/CartItem/CartItem';
import CartSummary from '../../components/CartSummary/CartSummary';
import { CartProvider } from '../../context/CartContext';

// Mock product data
const mockProducts = [
  { id: 1, name: 'Test Product 1', price: 10.99, image: 'test1.jpg' },
  { id: 2, name: 'Test Product 2', price: 20.99, image: 'test2.jpg' },
];

// Mock useProducts hook
jest.mock('../../hooks/useProducts', () => ({
  __esModule: true,
  default: () => ({
    products: mockProducts,
    loading: false,
    error: null,
  }),
}));

describe('Cart Integration Tests', () => {
  const renderWithCart = (component) => {
    return render(
      <CartProvider>
        {component}
      </CartProvider>
    );
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('adding products to cart updates CartSummary totals', async () => {
    const { rerender } = renderWithCart(
      <>
        <ProductList />
        <CartSummary />
      </>
    );

    // Find and click "Add to Cart" buttons
    const addToCartButtons = await screen.findAllByText(/add to cart/i);
    await userEvent.click(addToCartButtons[0]); // Add first product

    // Verify CartSummary updates
    expect(screen.getByText('Total Items:')).toHaveTextContent('1');
    expect(screen.getByText(/\$10.99/)).toBeInTheDocument();

    // Add second product
    await userEvent.click(addToCartButtons[1]);
    
    // Verify updated totals
    expect(screen.getByText('Total Items:')).toHaveTextContent('2');
    expect(screen.getByText(/\$31.98/)).toBeInTheDocument();
  });

  test('updating cart item quantity updates CartSummary', async () => {
    const mockItem = { ...mockProducts[0], quantity: 1 };
    
    renderWithCart(
      <>
        <CartItem item={mockItem} />
        <CartSummary />
      </>
    );

    // Find quantity controls
    const addButton = screen.getByTestId('AddIcon').closest('button');
    
    // Increase quantity
    await userEvent.click(addButton);
    
    // Verify updated totals
    expect(screen.getByText('Total Items:')).toHaveTextContent('2');
    expect(screen.getByText(/\$21.98/)).toBeInTheDocument();
  });

  test('removing item from cart updates CartSummary', async () => {
    const mockItem = { ...mockProducts[0], quantity: 2 };
    
    renderWithCart(
      <>
        <CartItem item={mockItem} />
        <CartSummary />
      </>
    );

    // Find and click delete button
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    await userEvent.click(deleteButton);
    
    // Verify cart is empty
    expect(screen.getByText('Total Items:')).toHaveTextContent('0');
    expect(screen.getByText(/\$0.00/)).toBeInTheDocument();
  });

  test('cart persists after page refresh', async () => {
    const { rerender } = renderWithCart(
      <>
        <ProductList />
        <CartSummary />
      </>
    );

    // Add product to cart
    const addToCartButton = await screen.findAllByText(/add to cart/i);
    await userEvent.click(addToCartButton[0]);

    // Verify initial state
    expect(screen.getByText('Total Items:')).toHaveTextContent('1');
    expect(screen.getByText(/\$10.99/)).toBeInTheDocument();

    // Simulate page refresh by re-rendering
    rerender(
      <CartProvider>
        <CartSummary />
      </CartProvider>
    );

    // Verify state persists
    expect(screen.getByText('Total Items:')).toHaveTextContent('1');
    expect(screen.getByText(/\$10.99/)).toBeInTheDocument();
  });
});