import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from '../components/Footer/Footer';

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Footer', () => {
  it('renders all sections correctly', () => {
    renderWithTheme(<Footer />);
    
    // Check main sections
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('displays correct about us content', () => {
    renderWithTheme(<Footer />);
    
    expect(screen.getByText(/Armazon is your one-stop shop/)).toBeInTheDocument();
  });

  it('renders all quick links', () => {
    renderWithTheme(<Footer />);
    
    const homeLink = screen.getByText('Home');
    const productsLink = screen.getByText('Products');
    const cartLink = screen.getByText('Cart');

    expect(homeLink).toBeInTheDocument();
    expect(productsLink).toBeInTheDocument();
    expect(cartLink).toBeInTheDocument();

    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    expect(productsLink.closest('a')).toHaveAttribute('href', '/products');
    expect(cartLink.closest('a')).toHaveAttribute('href', '/cart');
  });

  it('displays correct contact information', () => {
    renderWithTheme(<Footer />);
    
    expect(screen.getByText('Email: support@armazon.com')).toBeInTheDocument();
    expect(screen.getByText('Phone: (555) 123-4567')).toBeInTheDocument();
  });

  it('displays current year in copyright notice', () => {
    renderWithTheme(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Armazon. All rights reserved.`)).toBeInTheDocument();
  });

  it('applies correct styling to footer wrapper', () => {
    const { container } = renderWithTheme(<Footer />);
    
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
    
    const styles = window.getComputedStyle(footerElement);
    expect(styles.marginTop).toBe('auto');
  });

  it('renders footer links with correct hover state', async () => {
    renderWithTheme(<Footer />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveStyle({ textDecoration: 'none' });
    });
  });

  it('maintains responsive layout structure', () => {
    renderWithTheme(<Footer />);
    
    const gridContainer = screen.getByText('About Us').closest('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
    
    const gridItems = gridContainer.querySelectorAll('.MuiGrid-item');
    expect(gridItems.length).toBe(3); // About Us, Quick Links, Contact Us sections
  });
});