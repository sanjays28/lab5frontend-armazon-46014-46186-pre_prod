import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useCart } from '../../hooks/useCart';

// PUBLIC_INTERFACE
const CartSummary = () => {
  const { totalItems, totalAmount } = useCart();

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log('Proceeding to checkout...');
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" component="div">
          Cart Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Total Items:</Typography>
          <Typography>{totalItems}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Total Amount:</Typography>
          <Typography>${totalAmount.toFixed(2)}</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCheckout}
          disabled={totalItems === 0}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Paper>
  );
};

export default CartSummary;