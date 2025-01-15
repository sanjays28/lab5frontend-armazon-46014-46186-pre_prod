import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';
import ProductList from '../components/ProductList/ProductList';
import theme from '../theme/theme';

// Helper function to wait for Material-UI animations
const waitForMuiAnimation = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock the custom hook
jest.mock('../hooks/useProducts', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock the child components
jest.mock('../components/ProductCard/ProductCard', () => {
  return function MockProductCard({ product }) {
    return (
      <div data-testid={`product-card-${product.id}`} className="product-card" key={product.id}>
        <div data-testid={`product-name-${product.id}`}>{product.name}</div>
        <div data-testid={`product-price-${product.id}`}>${product.price}</div>
      </div>
    );
  };
});

jest.mock('../components/SearchBar/SearchBar', () => {
  return function MockSearchBar({ onSearch, isLoading }) {
    return (
      <div data-testid="search-bar" className="search-bar">
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          role="textbox"
          aria-label="Search products"
        />
        {isLoading && <div data-testid="search-loading" aria-label="Loading">Loading...</div>}
      </div>
    );
  };
});

// Increase test timeout
jest.setTimeout(10000);

import useProducts from '../hooks/useProducts';

describe('ProductList Component', () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
    { id: 3, name: 'Product 3', price: 30 }
  ];

  beforeEach(() => {
    useProducts.mockClear();
  });

  test('displays loading state when products are being fetched', () => {
    useProducts.mockReturnValue({
      products: [],
      loading: true,
      error: null
    });

    render(<ProductList onAddToCart={() => {}} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    const errorMessage = 'Failed to fetch products';
    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: errorMessage
    });

    render(<ProductList onAddToCart={() => {}} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('displays "No products found" message when product list is empty', () => {
    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null
    });

    render(<ProductList onAddToCart={() => {}} />);
    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });

  test('renders grid layout with product cards when products are available', async () => {
    useProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null
    });

    render(
      <ThemeProvider theme={theme}>
        <ProductList onAddToCart={() => {}} />
      </ThemeProvider>
    );

    // Wait for grid layout to be rendered
    await waitFor(() => {
      // Check if search bar is rendered
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();

      // Check if all product cards are rendered
      mockProducts.forEach(product => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });

      // Check if grid container is present
      const gridContainer = document.querySelector('.MuiGrid-container');
      expect(gridContainer).toBeInTheDocument();

      // Check if grid items are present
      const gridItems = document.querySelectorAll('.MuiGrid-item');
      expect(gridItems).toHaveLength(mockProducts.length);
    });
  });

  describe('Snapshot Tests', () => {
    const renderWithTheme = async (component) => {
      let tree;
      await act(async () => {
        tree = renderer.create(
          <ThemeProvider theme={theme}>
            {component}
          </ThemeProvider>
        );
        await waitForMuiAnimation();
      });
      return tree;
    };

    test('matches loading state snapshot', async () => {
      useProducts.mockReturnValue({
        products: [],
        loading: true,
        error: null
      });

      const tree = await renderWithTheme(<ProductList onAddToCart={() => {}} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches error state snapshot', async () => {
      const errorMessage = 'Failed to fetch products';
      useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: errorMessage
      });

      const tree = await renderWithTheme(<ProductList onAddToCart={() => {}} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches empty products state snapshot', async () => {
      useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: null
      });

      const tree = await renderWithTheme(<ProductList onAddToCart={() => {}} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches populated products list snapshot', async () => {
      useProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null
      });

      const tree = await renderWithTheme(<ProductList onAddToCart={() => {}} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot with different screen sizes', async () => {
      useProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null
      });

      const originalMatchMedia = window.matchMedia;
      const mockMatchMedia = (query) => ({
        matches: query === '(min-width: 960px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      });

      window.matchMedia = mockMatchMedia;
      const desktopTree = await renderWithTheme(<ProductList onAddToCart={() => {}} />);
      expect(desktopTree.toJSON()).toMatchSnapshot('desktop view');

      window.matchMedia = (query) => ({
        ...mockMatchMedia(query),
        matches: false,
      });
      const mobileTree = await renderWithTheme(<ProductList onAddToCart={() => {}} />);
      expect(mobileTree.toJSON()).toMatchSnapshot('mobile view');

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('Search Integration', () => {
    const searchResults = [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Laptop Bag', price: 49 }
    ];

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('updates search results when search query changes', async () => {
      // Initial render with empty results
      useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Mock the search results
      useProducts.mockReturnValue({
        products: searchResults,
        loading: false,
        error: null
      });

      // Trigger search
      fireEvent.change(screen.getByTestId('search-input'), {
        target: { value: 'laptop' }
      });

      // Fast-forward timers to handle debounce
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Wait for the results to be displayed
      await waitFor(() => {
        searchResults.forEach(product => {
          expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
          expect(screen.getByText(product.name)).toBeInTheDocument();
        });
      });
    });

    test('shows loading state during search', async () => {
      // Initial state
      useProducts.mockReturnValue({
        products: [],
        loading: true,
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Trigger search
      fireEvent.change(screen.getByTestId('search-input'), {
        target: { value: 'laptop' }
      });

      // Verify loading state
      expect(screen.getByTestId('search-loading')).toBeInTheDocument();

      // Update mock to finished state
      useProducts.mockReturnValue({
        products: searchResults,
        loading: false,
        error: null
      });

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Verify loading indicator is removed
      await waitFor(() => {
        expect(screen.queryByTestId('search-loading')).not.toBeInTheDocument();
      });
    });

    test('handles empty search results', async () => {
      // Initial render
      useProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Update to empty results
      useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: null
      });

      // Trigger search
      fireEvent.change(screen.getByTestId('search-input'), {
        target: { value: 'nonexistent' }
      });

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Verify "No products found" message
      await waitFor(() => {
        expect(screen.getByText('No products found.')).toBeInTheDocument();
      });
    });

    test('handles search error state', async () => {
      const errorMessage = 'Search failed';
      
      // Initial render
      useProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null
      });

      render(<ProductList onAddToCart={() => {}} />);

      // Update to error state
      useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: errorMessage
      });

      // Trigger search
      fireEvent.change(screen.getByTestId('search-input'), {
        target: { value: 'error' }
      });

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });
});
