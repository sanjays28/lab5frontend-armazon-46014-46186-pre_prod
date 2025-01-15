import React from 'react';
import { render, act } from '@testing-library/react';
import { CartContext, CartProvider, CART_ACTIONS } from '../../context/CartContext';
import { useContext } from 'react';

import mockLocalStorage from './__mocks__/localStorage';

global.localStorage = mockLocalStorage;

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const TestComponent = () => {
    const { state, dispatch } = useContext(CartContext);
    return (
      <div>
        <span data-testid="total-items">{state.totalItems}</span>
        <span data-testid="total-amount">{state.totalAmount}</span>
        <button
          data-testid="add-item"
          onClick={() =>
            dispatch({
              type: CART_ACTIONS.ADD_TO_CART,
              payload: { id: 1, price: 10, name: 'Test Product' },
            })
          }
        >
          Add Item
        </button>
      </div>
    );
  };

  it('initializes cart with empty state', () => {
    localStorage.getItem.mockReturnValue(null);
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('total-items').textContent).toBe('0');
    expect(getByTestId('total-amount').textContent).toBe('0');
  });

  it('loads cart state from localStorage if available', () => {
    const savedState = {
      items: [{ id: 1, price: 10, name: 'Test Product', quantity: 1 }],
      totalItems: 1,
      totalAmount: 10,
    };
    localStorage.getItem.mockReturnValue(JSON.stringify(savedState));

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('total-items').textContent).toBe('1');
    expect(getByTestId('total-amount').textContent).toBe('10');
  });

  it('adds item to cart', () => {
    localStorage.getItem.mockReturnValue(null);
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
    });

    expect(getByTestId('total-items').textContent).toBe('1');
    expect(getByTestId('total-amount').textContent).toBe('10');
  });

  it('persists cart state to localStorage when updated', () => {
    localStorage.getItem.mockReturnValue(null);
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByTestId('add-item').click();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      expect.stringContaining('"totalItems":1')
    );
  });
});
