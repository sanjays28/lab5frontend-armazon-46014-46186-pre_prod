import React, { useState } from 'react';
import { Grid, Container, Box, Button, Alert } from '@mui/material';
import ProductCard from '../ProductCard/ProductCard';
import SearchBar from '../SearchBar/SearchBar';
import ProductListSkeleton from './ProductListSkeleton';
import useProducts from '../../hooks/useProducts';

// PUBLIC_INTERFACE
const ProductList = ({ onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error } = useProducts(searchQuery);

  const handleRetry = () => {
    setSearchQuery(searchQuery); // This will trigger a re-fetch
  };

  const renderContent = () => {
    if (loading) {
      return <ProductListSkeleton data-testid="loading-spinner" />;
    }

    if (error) {
      return (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                RETRY
              </Button>
            }
            data-testid="error-message"
          >
            {error}
          </Alert>
        </Box>
      );
    }

    if (!products || !products.length) {
      return (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Alert severity="info" data-testid="no-products-message">
            No products found. Try adjusting your search criteria.
          </Alert>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard 
              product={product}
              onAddToCart={onAddToCart}
            />
          </Grid>
        ))}
      </Grid>
    );
  };
  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <SearchBar 
            onSearch={setSearchQuery} 
            isLoading={loading} 
            disabled={loading}
          />
        </Box>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default ProductList;
