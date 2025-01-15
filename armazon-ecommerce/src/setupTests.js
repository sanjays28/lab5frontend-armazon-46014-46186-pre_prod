// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.computedStyle
window.computedStyle = jest.fn();

// Increase default timeout for tests
jest.setTimeout(10000);

import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act } from '@testing-library/react';

// Increase Jest timeout for async tests
jest.setTimeout(10000);

// Create a default theme for Material-UI tests
const theme = createTheme();

// Global test utilities
global.actAsync = async (callback) => {
  await act(async () => {
    await callback();
  });
};

// Configure testing-library
configure({ 
  testIdAttribute: 'data-testid',
  // Add a custom wait time for async operations
  asyncUtilTimeout: 5000,
  // Configure which queries are considered useful
  computedStyleSupportsPseudoElements: true,
  // Default option for whether to retry queries that fail
  defaultHidden: true
});

// Setup custom jest matchers for Material-UI
expect.extend({
  toHaveStyleRule(received, property, value) {
    const style = window.getComputedStyle(received);
    const pass = style[property] === value;
    return {
      pass,
      message: () =>
        `expected ${received} to have CSS property "${property}" with value "${value}"`,
    };
  },
  toHaveMuiStyle(received, property, value) {
    const element = received.querySelector('.MuiTypography-root, .MuiButton-root, .MuiPaper-root');
    if (!element) {
      return {
        pass: false,
        message: () => 'No Material-UI component found',
      };
    }
    const style = window.getComputedStyle(element);
    const pass = style[property] === value;
    return {
      pass,
      message: () =>
        `expected Material-UI component to have CSS property "${property}" with value "${value}"`,
    };
  },
  toBeVisibleInViewport(received) {
    const element = received.nodeType === Node.ELEMENT_NODE ? received : received.parentElement;
    if (!element) {
      return {
        pass: false,
        message: () => 'Element not found in DOM',
      };
    }
    const rect = element.getBoundingClientRect();
    const pass = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    return {
      pass,
      message: () =>
        pass ? 'Element is visible in viewport' : 'Element is not visible in viewport',
    };
  },
});

// Mock IntersectionObserver for Material-UI components
class MockIntersectionObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock window.matchMedia for Material-UI responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for Material-UI components
class MockResizeObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}

window.ResizeObserver = MockResizeObserver;

// Add TextEncoder/TextDecoder for async operations
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
      /Warning: useLayoutEffect does nothing on the server/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock fetch API
global.fetch = jest.fn();

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

// Provide a helper for wrapping components with Material-UI theme
global.withTheme = (component) => {
  return (
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Add custom async utilities
global.waitForMuiAnimation = () => new Promise(resolve => setTimeout(resolve, 300));
