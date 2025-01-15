import { useContext } from 'react';
import { CartContext, CART_ACTIONS } from '../context/CartContext';

// PUBLIC_INTERFACE
export const useCart = () => {
  const { state, dispatch } = useContext(CartContext);

  // PUBLIC_INTERFACE
  const addToCart = (product) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: product,
    });
  };

  // PUBLIC_INTERFACE
  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: { id: productId },
    });
  };

  // PUBLIC_INTERFACE
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  };

  // PUBLIC_INTERFACE
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  return {
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};