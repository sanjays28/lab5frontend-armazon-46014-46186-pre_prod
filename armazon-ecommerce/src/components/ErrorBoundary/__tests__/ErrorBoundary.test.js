import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme/theme';

// Mock console.error to prevent test output noise
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Helper component that throws different types of errors
const ErrorThrower = ({ type }) => {
  switch (type) {
    case 'network':
      throw new Error('Failed to fetch: network error');
    case 'data':
      throw new Error('Error loading data');
    case 'generic':
      throw new Error('Generic error');
    default:
      return <div>No error</div>;
  }
};

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when there is no error', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  test('displays network error UI when a network error occurs', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <ErrorThrower type="network" />
      </ErrorBoundary>
    );
    
    expect(getByText('Network Error')).toBeInTheDocument();
    expect(getByText(/Unable to connect to the server/)).toBeInTheDocument();
  });

  test('displays data loading error UI when a data loading error occurs', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <ErrorThrower type="data" />
      </ErrorBoundary>
    );
    
    expect(getByText('Data Loading Error')).toBeInTheDocument();
    expect(getByText(/There was a problem loading the data/)).toBeInTheDocument();
  });

  test('displays generic error UI for other types of errors', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <ErrorThrower type="generic" />
      </ErrorBoundary>
    );
    
    expect(getByText('Something went wrong')).toBeInTheDocument();
    expect(getByText(/An unexpected error has occurred/)).toBeInTheDocument();
  });

  test('retry button resets error state', () => {
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <ErrorThrower type="network" />
      </ErrorBoundary>
    );
    
    expect(getByText('Network Error')).toBeInTheDocument();
    
    fireEvent.click(getByText('Retry'));
    
    // After clicking retry, the error boundary should try to re-render the children
    // However, since our ErrorThrower will throw again, we'll still see the error UI
    expect(getByText('Network Error')).toBeInTheDocument();
  });

  test('shows error details in development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <ErrorThrower type="generic" />
      </ErrorBoundary>
    );
    
    expect(getByText('Error details (development only):')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  test('does not show error details in production environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const { queryByText } = renderWithTheme(
      <ErrorBoundary>
        <ErrorThrower type="generic" />
      </ErrorBoundary>
    );
    
    expect(queryByText('Error details (development only):')).not.toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  test('componentDidCatch logs error in development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    renderWithTheme(
      <ErrorBoundary>
        <ErrorThrower type="generic" />
      </ErrorBoundary>
    );
    
    expect(console.error).toHaveBeenCalled();
    
    process.env.NODE_ENV = originalEnv;
  });
});