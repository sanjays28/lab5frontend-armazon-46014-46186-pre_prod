// Mock product data - in a real application, this would come from an API
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://via.placeholder.com/200',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring',
    price: 299.99,
    image: 'https://via.placeholder.com/200',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Laptop Backpack',
    description: 'Durable laptop backpack with multiple compartments',
    price: 49.99,
    image: 'https://via.placeholder.com/200',
    category: 'Accessories'
  }
];

// PUBLIC_INTERFACE
export const getProducts = async () => {
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: products, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch products' };
  }
};

// PUBLIC_INTERFACE
export const getProductById = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { data: product, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// PUBLIC_INTERFACE
export const searchProducts = async (query) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    return { data: filteredProducts, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to search products' };
  }
};