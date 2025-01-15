import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundSize: 'contain',
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

// PUBLIC_INTERFACE
const ProductCard = ({ product, onAddToCart }) => {
  const { title, price, image, description } = product;

  return (
    <StyledCard>
      <StyledCardMedia
        image={image}
        title={title}
      />
      <StyledCardContent>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${price.toFixed(2)}
        </Typography>
      </StyledCardContent>
      <CardActions>
        <Button 
          size="small" 
          color="primary" 
          variant="contained"
          onClick={() => onAddToCart(product)}
          fullWidth
        >
          Add to Cart
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default ProductCard;