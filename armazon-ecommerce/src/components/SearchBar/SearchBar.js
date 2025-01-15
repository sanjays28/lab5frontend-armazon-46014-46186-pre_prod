import React, { useState, useCallback, useEffect } from 'react';
import { TextField, CircularProgress, InputAdornment, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ErrorIcon from '@mui/icons-material/Error';
import debounce from 'lodash/debounce';

// PUBLIC_INTERFACE
const SearchBar = ({ onSearch, isLoading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search callback with a 500ms delay
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search products..."
      value={searchTerm}
      onChange={handleSearchChange}
      data-testid="search-field"
      inputProps={{
        'data-testid': 'search-input',
        role: 'textbox',
        'aria-label': 'Search products'
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon data-testid="search-icon" />
          </InputAdornment>
        ),
        endAdornment: isLoading && (
          <InputAdornment position="end">
            <CircularProgress size={20} data-testid="loading-spinner" />
          </InputAdornment>
        ),
      }}
      sx={{
        maxWidth: '600px',
        margin: '16px auto',
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
        },
      }}
    />
    {error && (
      <Alert 
        severity="error" 
        data-testid="search-error"
        sx={{ 
          maxWidth: '600px', 
          margin: '8px auto',
          alignItems: 'center'
        }}
        icon={<ErrorIcon />}
      >
        {error}
      </Alert>
    )}
    </>
  );
};

export default SearchBar;
