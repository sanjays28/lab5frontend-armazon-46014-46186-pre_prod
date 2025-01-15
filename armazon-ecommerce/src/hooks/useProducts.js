import { useState, useEffect } from 'react';
import { getProducts, searchProducts } from '../services/productService';

// PUBLIC_INTERFACE
const useProducts = (searchQuery = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = searchQuery
          ? await searchProducts(searchQuery)
          : await getProducts();

        if (result.error) {
          throw new Error(result.error);
        }

        setProducts(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return {
    products,
    loading,
    error,
  };
};

export default useProducts;