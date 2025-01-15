import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  ButtonGroup,
  Button,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../../hooks/useCart';

// PUBLIC_INTERFACE
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <Card sx={{ display: 'flex', mb: 2, p: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: 'contain' }}
        image={item.image}
        alt={item.name}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" component="div">
            {item.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ${item.price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <ButtonGroup size="small" aria-label="quantity controls">
            <IconButton onClick={() => handleQuantityChange(-1)} disabled={item.quantity <= 1}>
              <RemoveIcon />
            </IconButton>
            <Button disabled>{item.quantity}</Button>
            <IconButton onClick={() => handleQuantityChange(1)}>
              <AddIcon />
            </IconButton>
          </ButtonGroup>
          <Typography variant="body1" sx={{ mx: 2 }}>
            Total: ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <IconButton onClick={handleRemove} color="error" aria-label="remove item">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;