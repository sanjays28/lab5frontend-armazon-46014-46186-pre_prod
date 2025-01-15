import React from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  Skeleton 
} from '@mui/material';

// PUBLIC_INTERFACE
const ProductDetailSkeleton = () => {
  return (
    <Box m={2}>
      <Card>
        <Skeleton
          variant="rectangular"
          height={400}
          animation="wave"
          sx={{ objectFit: 'contain' }}
        />
        <CardContent>
          {/* Product Title */}
          <Skeleton 
            variant="text" 
            height={40} 
            width="60%" 
            animation="wave" 
            sx={{ mb: 1 }}
          />
          
          {/* Price */}
          <Skeleton 
            variant="text" 
            height={32} 
            width="20%" 
            animation="wave" 
            sx={{ mb: 2 }}
          />
          
          {/* Description - multiple lines */}
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" width="80%" animation="wave" />
          </Box>
          
          {/* Category */}
          <Skeleton 
            variant="text" 
            height={24} 
            width="30%" 
            animation="wave" 
            sx={{ mb: 2 }}
          />
          
          {/* Add to Cart Button */}
          <Skeleton 
            variant="rectangular" 
            height={42} 
            width={140} 
            animation="wave"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetailSkeleton;