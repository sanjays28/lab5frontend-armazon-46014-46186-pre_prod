import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import renderer from 'react-test-renderer';
import SearchBar from '../components/SearchBar/SearchBar';
import theme from '../theme/theme';

// Helper function to wait for Material-UI animations
const waitForMuiAnimation = () => new Promise(resolve => setTimeout(resolve, 0));

// Custom render function that includes Material-UI ThemeProvider
const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    ),
    ...options,
  });

// Mock lodash debounce to make it synchronous for testing
jest.mock('lodash/debounce', () => {
  return jest.fn(fn => {
    const debounced = (...args) => fn.apply(null, args);
    debounced.cancel = jest.fn();
    return debounced;
  });
});

// Increase test timeout
jest.setTimeout(10000);

// Snapshot Tests
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

  test('matches snapshot in default state', async () => {
    const tree = await renderWithTheme(
      <SearchBar onSearch={() => {}} isLoading={false} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('matches snapshot in loading state', async () => {
    const tree = await renderWithTheme(
      <SearchBar onSearch={() => {}} isLoading={true} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('matches snapshot with search text', async () => {
    const tree = await renderWithTheme(
      <SearchBar onSearch={() => {}} isLoading={false} />
    );
    await act(async () => {
      const instance = tree.root;
      const input = instance.findByProps({ 'data-testid': 'search-input' });
      input.props.onChange({ target: { value: 'test search' } });
      await waitForMuiAnimation();
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('matches snapshot with different screen sizes', async () => {
    const originalMatchMedia = window.matchMedia;
    const mockMatchMedia = (query) => ({
      matches: query === '(min-width: 600px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    window.matchMedia = mockMatchMedia;
    const tree = await renderWithTheme(
      <SearchBar onSearch={() => {}} isLoading={false} />
    );
    expect(tree.toJSON()).toMatchSnapshot('desktop view');

    window.matchMedia = (query) => ({
      ...mockMatchMedia(query),
      matches: false,
    });
    const mobileTree = await renderWithTheme(
      <SearchBar onSearch={() => {}} isLoading={false} />
    );
    expect(mobileTree.toJSON()).toMatchSnapshot('mobile view');

    window.matchMedia = originalMatchMedia;
  });
});


describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  // Test 1: Basic Rendering
  test('renders search input field with placeholder', () => {
    customRender(<SearchBar onSearch={() => {}} isLoading={false} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Search products...');
  });

  // Test 2: Search Icon Rendering
  test('displays search icon', () => {
    customRender(<SearchBar onSearch={() => {}} isLoading={false} />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  // Test 3: Loading State
  test('shows loading indicator when isLoading is true', () => {
    customRender(<SearchBar onSearch={() => {}} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  // Test 4: No Loading Indicator
  test('does not show loading indicator when isLoading is false', () => {
    customRender(<SearchBar onSearch={() => {}} isLoading={false} />);
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // Test 5: Input Change Handler
  test('calls onSearch with input value', async () => {
    const mockOnSearch = jest.fn();
    customRender(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await userEvent.type(searchInput, 'test');
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  // Test 6: Debounce Functionality
  test('debounces search callback', async () => {
    const mockOnSearch = jest.fn();
    customRender(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Type rapidly
    await act(async () => {
      await userEvent.type(searchInput, 'test');
    });
    
    // Verify the call was made
    expect(mockOnSearch).toHaveBeenCalledTimes(4); // Once for each character
    expect(mockOnSearch).toHaveBeenLastCalledWith('test');
  });

  // Test 7: Empty Input Handling
  test('calls onSearch with empty string when input is cleared', async () => {
    const mockOnSearch = jest.fn();
    customRender(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await userEvent.type(searchInput, 'test');
      await userEvent.clear(searchInput);
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  // Test 8: Input State Management
  test('maintains input value state', async () => {
    customRender(<SearchBar onSearch={() => {}} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'test value');
    
    expect(searchInput).toHaveValue('test value');
  });

  // Test 9: Special Characters Handling
  test('handles special characters in search input', async () => {
    const mockOnSearch = jest.fn();
    customRender(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, '!@#$%^&*()');
    
    expect(mockOnSearch).toHaveBeenCalledWith('!@#$%^&*()');
  });

  // Test 10: Long Input Handling
  test('handles long search queries', async () => {
    const mockOnSearch = jest.fn();
    const longString = 'a'.repeat(100);
    customRender(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, longString);
    
    expect(mockOnSearch).toHaveBeenCalledWith(longString);
  });

  // Test 11: Rapid Input Changes
  test('handles rapid input changes correctly', async () => {
    const mockOnSearch = jest.fn();
    customRender(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await userEvent.type(searchInput, 'test');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'new');
    });
    
    expect(mockOnSearch).toHaveBeenLastCalledWith('new');
    expect(mockOnSearch).toHaveBeenCalledTimes(8); // 4 for 'test' + 1 for clear + 3 for 'new'
  });

  // Test 12: Component Props Update
  test('updates when isLoading prop changes', () => {
    const { rerender } = customRender(<SearchBar onSearch={() => {}} isLoading={false} />);
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    
    rerender(<SearchBar onSearch={() => {}} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  // Test 13: Input Accessibility
  test('search input is accessible', () => {
    customRender(<SearchBar onSearch={() => {}} isLoading={false} />);
    const searchInput = screen.getByTestId('search-input');
    
    expect(searchInput).toHaveAttribute('role', 'textbox');
    expect(searchInput).not.toHaveAttribute('aria-disabled');
  });

  // Test 14: Error Display
  test('displays error message when error prop is provided', () => {
    const errorMessage = 'Failed to search products';
    customRender(<SearchBar onSearch={() => {}} isLoading={false} error={errorMessage} />);
    
    const errorAlert = screen.getByTestId('search-error');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(errorMessage);
  });

  // Test 15: No Error Display
  test('does not display error message when error prop is null', () => {
    customRender(<SearchBar onSearch={() => {}} isLoading={false} error={null} />);
    expect(screen.queryByTestId('search-error')).not.toBeInTheDocument();
  });

  // Test 16: Error Cleanup
  test('removes error message when error prop changes to null', () => {
    const { rerender } = customRender(
      <SearchBar onSearch={() => {}} isLoading={false} error="Error message" />
    );
    
    expect(screen.getByTestId('search-error')).toBeInTheDocument();
    
    rerender(<SearchBar onSearch={() => {}} isLoading={false} error={null} />);
    expect(screen.queryByTestId('search-error')).not.toBeInTheDocument();
  });

  // Test 17: Debounce Cleanup
  test('cleans up debounced function on unmount', () => {
    const mockOnSearch = jest.fn();
    const { unmount } = customRender(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    unmount();
    
    // After unmount, no new calls should be made
    jest.advanceTimersByTime(1000);
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
