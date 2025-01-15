import React from 'react';
import { Grid, Container, Box, Skeleton, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ProductCardSkeleton = () => (
  <StyledCard>
    <Skeleton
      variant="rectangular"
      sx={{
        paddingTop: '56.25%', // 16:9 aspect ratio
        backgroundSize: 'contain',
      }}
      animation="wave"
    />
    <Box sx={{ p: 2, flexGrow: 1 }}>
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} animation="wave" />
      <Skeleton variant="text" width="100%" height={20} animation="wave" />
      <Skeleton variant="text" width="100%" height={20} animation="wave" />
      <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} animation="wave" />
    </Box>
    <Box sx={{ p: 2, pt: 0 }}>
      <Skeleton variant="rectangular" height={36} width="100%" animation="wave" />
    </Box>
  </StyledCard>
);

// PUBLIC_INTERFACE
const ProductListSkeleton = () => {
  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={56} animation="wave" />
        </Box>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductListSkeleton;