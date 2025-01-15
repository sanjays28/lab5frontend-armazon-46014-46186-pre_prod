import { createContext, useReducer, useEffect } from 'react';

// Create cart context
export const CartContext = createContext();

// Cart actions
export const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

// Initial cart state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price,
        };
      }

      const newItem = {
        ...action.payload,
        quantity: 1,
      };

      return {
        ...state,
        items: [...state.items, newItem],
        totalItems: state.totalItems + 1,
        totalAmount: state.totalAmount + action.payload.price,
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (!existingItem) return state;

      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - existingItem.quantity,
        totalAmount: state.totalAmount - (existingItem.price * existingItem.quantity),
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state;

      const existingItemIndex = state.items.findIndex(
        (item) => item.id === id
      );

      if (existingItemIndex === -1) return state;

      const item = state.items[existingItemIndex];
      const quantityDiff = quantity - item.quantity;

      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
          };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + (item.price * quantityDiff),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : initialState;
    }
    return initialState;
  });

  // Persist cart state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
