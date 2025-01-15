import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../hooks/useCart';
import { CartProvider } from '../../context/CartContext';
import React from 'react';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

describe('useCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.getItem.mockReturnValue(null);
  });

  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

  const testProduct = {
    id: 1,
    name: 'Test Product',
    price: 10,
  };

  it('provides initial empty cart state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      ...testProduct,
      quantity: 1,
    });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalAmount).toBe(10);
  });

  it('increases quantity when adding same item multiple times', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testProduct);
      result.current.addToCart(testProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalAmount).toBe(20);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testProduct);
      result.current.removeFromCart(testProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testProduct);
      result.current.updateQuantity(testProduct.id, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalAmount).toBe(30);
  });

  it('does not update quantity below 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testProduct);
      result.current.updateQuantity(testProduct.id, 0);
    });

    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalAmount).toBe(10);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testProduct);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('persists cart state in localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testProduct);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      expect.stringContaining('"totalItems":1')
    );
  });
});