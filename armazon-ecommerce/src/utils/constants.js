// Application-wide constants

// PUBLIC_INTERFACE
export const APP_NAME = 'Armazon E-commerce';

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
};

// API endpoints will be added here
export const API = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
};