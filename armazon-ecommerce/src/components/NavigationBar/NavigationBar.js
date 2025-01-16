import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { useCart } from '../../hooks/useCart';

// PUBLIC_INTERFACE
const NavigationBar = () => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { cart } = useCart();
  const navigate = useNavigate();

  const categories = [
    { name: 'Electronics', path: '/category/electronics' },
    { name: 'Clothing', path: '/category/clothing' },
    { name: 'Books', path: '/category/books' },
    { name: 'Home & Garden', path: '/category/home-garden' },
  ];

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleCategorySelect = (path) => {
    navigate(path);
    handleCategoryMenuClose();
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <AppBar position="fixed">
      <Toolbar>
        {isMobile && (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem component={Link} to="/" onClick={handleMobileMenuClose}>
                Home
              </MenuItem>
              <MenuItem component={Link} to="/products" onClick={handleMobileMenuClose}>
                Products
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category.path}
                  onClick={() => {
                    handleCategorySelect(category.path);
                    handleMobileMenuClose();
                  }}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 0,
            textDecoration: 'none',
            color: 'inherit',
            marginRight: 2
          }}
        >
          Armazon
        </Typography>

        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography
              component={Link}
              to="/"
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              Home
            </Typography>
            <Typography
              component={Link}
              to="/products"
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              Products
            </Typography>
            <Button
              color="inherit"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleCategoryMenuOpen}
            >
              Categories
            </Button>
            <Menu
              anchorEl={categoryMenuAnchor}
              open={Boolean(categoryMenuAnchor)}
              onClose={handleCategoryMenuClose}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.path}
                  onClick={() => handleCategorySelect(category.path)}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}

        <Box sx={{ flexGrow: 1, mx: 2 }}>
          <SearchBar />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={handleUserMenuOpen}
            aria-label="user account"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
          >
            <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
              Profile
            </MenuItem>
            <MenuItem component={Link} to="/orders" onClick={handleUserMenuClose}>
              Orders
            </MenuItem>
            <MenuItem component={Link} to="/settings" onClick={handleUserMenuClose}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
          </Menu>
          
          <IconButton
            color="inherit"
            component={Link}
            to="/cart"
            aria-label="cart"
            sx={{ position: 'relative' }}
          >
            <ShoppingCartIcon />
            {cartItemCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '0.75rem',
                }}
              >
                {cartItemCount}
              </Box>
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;