import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardMedia, 
  CardContent,
  Alert
} from '@mui/material';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import { getProductById } from '../../services/productService';

// PUBLIC_INTERFACE
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await getProductById(Number(id));
      if (error) {
        setError(error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box m={2}>
        <Alert severity="info">Product not found</Alert>
      </Box>
    );
  }

  return (
    <Box m={2}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'contain' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="h1">
            {product.name}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Category: {product.category}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => {
              // TODO: Implement add to cart functionality
              console.log('Add to cart:', product.id);
            }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetail;
