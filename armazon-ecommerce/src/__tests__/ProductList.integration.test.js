import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../components/ProductList/ProductList';
import * as productService from '../services/productService';

// Spy on the service methods
jest.spyOn(productService, 'getProducts');
jest.spyOn(productService, 'searchProducts');

// Mock the child components for isolation
jest.mock('../components/ProductCard/ProductCard', () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.name}</div>;
  };
});

jest.mock('../components/SearchBar/SearchBar', () => {
  return function MockSearchBar({ onSearch, isLoading }) {
    return (
      <div data-testid="search-bar">
        <input
          type="text"
          data-testid="search-input"
          onChange={(e) => onSearch(e.target.value)}
        />
        {isLoading && <div data-testid="search-loading">Loading...</div>}
      </div>
    );
  };
});

describe('ProductList Data Integration', () => {
  const mockProducts = [
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
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Data Loading', () => {
    test('successfully fetches and displays products on mount', async () => {
      // Mock successful API response
      productService.getProducts.mockResolvedValueOnce({
        data: mockProducts,
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Verify loading state
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Wait for products to load
      await waitFor(() => {
        mockProducts.forEach(product => {
          expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
          expect(screen.getByText(product.name)).toBeInTheDocument();
        });
      });

      // Verify service was called correctly
      expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });

    test('handles network error during initial load', async () => {
      // Mock API error
      productService.getProducts.mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<ProductList onAddToCart={() => {}} />);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });

    test('handles empty product list response', async () => {
      // Mock empty response
      productService.getProducts.mockResolvedValueOnce({
        data: [],
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      await waitFor(() => {
        expect(screen.getByText('No products found.')).toBeInTheDocument();
      });

      expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('Search Integration with Service', () => {
    test('successfully fetches and displays search results', async () => {
      // Mock initial load
      productService.getProducts.mockResolvedValueOnce({
        data: mockProducts,
        error: null
      });

      // Mock search results
      const searchResults = [mockProducts[0]]; // Just the headphones
      productService.searchProducts.mockResolvedValueOnce({
        data: searchResults,
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Trigger search
      act(() => {
        screen.getByTestId('search-input').value = 'headphones';
        screen.getByTestId('search-input').dispatchEvent(
          new Event('change', { bubbles: true })
        );
      });

      // Verify search results
      await waitFor(() => {
        expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Smart Watch')).not.toBeInTheDocument();
      });

      expect(productService.searchProducts).toHaveBeenCalledWith('headphones');
    });

    test('handles service timeout during search', async () => {
      // Mock initial load
      productService.getProducts.mockResolvedValueOnce({
        data: mockProducts,
        error: null
      });

      // Mock search timeout
      productService.searchProducts.mockRejectedValueOnce(
        new Error('Request timeout')
      );

      render(<ProductList onAddToCart={() => {}} />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Trigger search
      act(() => {
        screen.getByTestId('search-input').value = 'test';
        screen.getByTestId('search-input').dispatchEvent(
          new Event('change', { bubbles: true })
        );
      });

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText('Request timeout')).toBeInTheDocument();
      });
    });

    test('handles malformed service response', async () => {
      // Mock initial load
      productService.getProducts.mockResolvedValueOnce({
        data: mockProducts,
        error: null
      });

      // Mock malformed response
      productService.searchProducts.mockResolvedValueOnce({
        data: null,
        error: 'Invalid response format'
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Trigger search
      act(() => {
        screen.getByTestId('search-input').value = 'test';
        screen.getByTestId('search-input').dispatchEvent(
          new Event('change', { bubbles: true })
        );
      });

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText('Invalid response format')).toBeInTheDocument();
      });
    });
  });

  describe('Service Response Validation', () => {
    test('validates product data structure from service', async () => {
      // Mock response with invalid product structure
      const invalidProducts = [
        {
          id: 1,
          name: 'Valid Product',
          price: 99.99
        },
        {
          // Missing required id
          name: 'Invalid Product',
          price: 149.99
        }
      ];

      productService.getProducts.mockResolvedValueOnce({
        data: invalidProducts,
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Only valid products should be displayed
      await waitFor(() => {
        expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        expect(screen.getByText('Valid Product')).toBeInTheDocument();
        expect(screen.queryByText('Invalid Product')).not.toBeInTheDocument();
      });
    });

    test('handles unexpected service response structure', async () => {
      // Mock completely invalid response
      productService.getProducts.mockResolvedValueOnce('invalid response');

      render(<ProductList onAddToCart={() => {}} />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});