import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  textAlign: 'center',
  maxWidth: 600,
  margin: '2rem auto',
}));

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in their child
 * component tree and displays fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  renderFallbackUI() {
    const { error } = this.state;
    
    // Network error fallback
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return (
        <ErrorContainer elevation={3}>
          <Typography variant="h5" color="error" gutterBottom>
            Network Error
          </Typography>
          <Typography variant="body1" paragraph>
            Unable to connect to the server. Please check your internet connection and try again.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRetry}
          >
            Retry
          </Button>
        </ErrorContainer>
      );
    }

    // Data loading error fallback
    if (error?.message?.includes('data') || error?.message?.includes('loading')) {
      return (
        <ErrorContainer elevation={3}>
          <Typography variant="h5" color="error" gutterBottom>
            Data Loading Error
          </Typography>
          <Typography variant="body1" paragraph>
            There was a problem loading the data. Please try again later.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRetry}
          >
            Retry
          </Button>
        </ErrorContainer>
      );
    }

    // Generic error fallback
    return (
      <ErrorContainer elevation={3}>
        <Typography variant="h5" color="error" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" paragraph>
          An unexpected error has occurred. Our team has been notified.
        </Typography>
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
            <Typography variant="body2" color="textSecondary">
              Error details (development only):
            </Typography>
            <pre style={{ 
              overflow: 'auto', 
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              {this.state.error?.toString()}
            </pre>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleRetry}
        >
          Try Again
        </Button>
      </ErrorContainer>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;