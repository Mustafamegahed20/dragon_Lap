import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { CartProvider } from './CartContext';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import logo from './assets/logo.jpg';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TikTokIcon from '@mui/icons-material/MusicNote';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LaptopIcon from '@mui/icons-material/Laptop';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HelpIcon from '@mui/icons-material/Help';

// Professional Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#1565c0',
      light: '#42a5f5',
    },
    secondary: {
      main: '#f57c00',
      dark: '#ef6c00',
      light: '#ffa726',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.1)',
    '0 4px 6px rgba(0, 0, 0, 0.1)',
    '0 10px 15px rgba(0, 0, 0, 0.1)',
    '0 20px 25px rgba(0, 0, 0, 0.15)',
    '0 25px 50px rgba(0, 0, 0, 0.25)',
    ...Array(19).fill('0 25px 50px rgba(0, 0, 0, 0.25)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

function getUserFromToken() {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
}

function NavBar({ onSignInHover, onSignInLeave, openSignIn, signInHover, anchorEl, setOpenSignIn, setSignInHover, setAnchorEl, handleSignOut }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const user = getUserFromToken();
  
  const navigationLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Products', path: '/products', icon: <LaptopIcon /> },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
    { label: 'FAQ', path: '/faq', icon: <HelpIcon /> },
    ...(user && user.is_admin ? [{ label: 'Admin', path: '/admin', icon: <AccountCircleIcon /> }] : []),
  ];

  const handleSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
        setDrawerOpen(false);
      }
    }
  };

  return (
    <>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img 
                  src={logo} 
                  alt="Dragon Lap Logo" 
                  style={{ 
                    height: isMobile ? 40 : 56, 
                    marginRight: 12,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Dragon Lap
                </Typography>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navigationLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Search Bar - Desktop */}
            {!isMobile && (
              <Box sx={{ flex: 1, mx: 4, maxWidth: 500 }}>
                <Paper
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(e);
                  }}
                  sx={{
                    p: '4px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 3,
                    boxShadow: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search laptops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    inputProps={{ 'aria-label': 'search laptops' }}
                  />
                  <IconButton 
                    type="submit" 
                    sx={{ p: '8px', color: 'primary.main' }} 
                    aria-label="search"
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Box>
            )}

            {/* Action Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <>
                  {user ? (
                    // Show user info and sign out when logged in
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        Welcome, {user.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSignOut}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Sign Out
                      </Button>
                    </Box>
                  ) : (
                    // Show sign in icon when not logged in
                    <IconButton
                      color="primary"
                      onMouseEnter={e => { setOpenSignIn(true); setSignInHover(true); setAnchorEl(e.currentTarget); }}
                      onMouseLeave={() => setTimeout(() => { if (!signInHover) { setOpenSignIn(false); setAnchorEl(null); } }, 100)}
                      onClick={() => navigate('/signin')}
                      sx={{ 
                        borderRadius: 2,
                        p: 1.5,
                        '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                      }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  )}
                  <IconButton 
                    color="primary" 
                    onClick={() => navigate('/cart')}
                    sx={{ 
                      borderRadius: 2,
                      p: 1.5,
                      '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                    }}
                  >
                    <Badge badgeContent={0} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                  <IconButton 
                    color="primary"
                    sx={{ 
                      borderRadius: 2,
                      p: 1.5,
                      '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                    }}
                  >
                    <Badge badgeContent={0} color="secondary">
                      <CompareArrowsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton 
                    color="primary"
                    sx={{ 
                      borderRadius: 2,
                      p: 1.5,
                      '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                    }}
                  >
                    <Badge badgeContent={0} color="secondary">
                      <FavoriteBorderIcon />
                    </Badge>
                  </IconButton>
                </>
              )}
              
              {isMobile && (
                <IconButton 
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: 'primary.main' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: 'background.paper' }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Mobile Search */}
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(e);
            }}
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              mb: 2,
              boxShadow: 1,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              inputProps={{ 'aria-label': 'search laptops' }}
            />
            <IconButton 
              type="submit" 
              sx={{ p: 1, color: 'primary.main' }}
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
          </Paper>

          {/* Mobile Navigation */}
          <List>
            {navigationLinks.map((link) => (
              <ListItem 
                button 
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Mobile Action Icons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {user ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Welcome, {user.name}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => { setDrawerOpen(false); handleSignOut(); }}
                  sx={{ textTransform: 'none' }}
                >
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() => { setDrawerOpen(false); navigate('/signin'); }}
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <IconButton 
                color="primary" 
                onClick={() => { setDrawerOpen(false); navigate('/cart'); }}
              >
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton color="primary">
                <Badge badgeContent={0} color="secondary">
                  <CompareArrowsIcon />
                </Badge>
              </IconButton>
              <IconButton color="primary">
                <Badge badgeContent={0} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

// Professional Footer Component
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Company Info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img src={logo} alt="Dragon Lap" style={{ height: 40, marginRight: 12, borderRadius: 8 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Dragon Lap
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Your trusted partner for premium laptops and computing solutions. Quality, performance, and customer satisfaction guaranteed.
            </Typography>
            
            {/* Social Media */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary" sx={{ '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" color="primary" sx={{ '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" color="primary" sx={{ '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                <YouTubeIcon />
              </IconButton>
              <IconButton size="small" color="primary" sx={{ '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                size="small" 
                color="primary" 
                sx={{ '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                onClick={() => window.open('https://wa.me/201060461071?text=Hello%20Dragon%20Lap!%20I%20would%20like%20to%20inquire%20about%20your%20laptops.', '_blank')}
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'FAQ', path: '/faq' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    color: '#4a5568',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1976d2'}
                  onMouseLeave={(e) => e.target.style.color = '#4a5568'}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Customer Service */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                📞 Phone: 01060461071
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📧 Email: info@dragonlap.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🕒 Hours: Mon-Fri 9AM-6PM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🚚 Free shipping on orders over 10000 EGP
              </Typography>
            </Box>
          </Box>

          {/* Newsletter */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe to get updates on new products and exclusive offers.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <InputBase
                placeholder="Enter email"
                sx={{
                  flex: 1,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.875rem',
                }}
              />
              <Button variant="contained" size="small" sx={{ px: 2 }}>
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Dragon Lap. All rights reserved. | Privacy Policy | Terms of Service
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  const user = getUserFromToken();
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [signInHover, setSignInHover] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Top Contact Bar */}
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                py: 0.75,
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '0.875rem'
              }}
            >
              <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'white' }}>
                    📞 24/7 Support: 01060461071
                  </Typography>
                  <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, color: 'white' }}>
                    🚚 Free shipping on orders over 10000 EGP
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <FacebookIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                    onClick={() => window.open('https://wa.me/201060461071?text=Hello%20Dragon%20Lap!%20I%20would%20like%20to%20inquire%20about%20your%20laptops.', '_blank')}
                  >
                    <WhatsAppIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Container>
            </Box>

            {/* Navigation */}
            <NavBar
              onSignInHover={() => setSignInHover(true)}
              onSignInLeave={() => setSignInHover(false)}
              openSignIn={openSignIn}
              signInHover={signInHover}
              anchorEl={anchorEl}
              setOpenSignIn={setOpenSignIn}
              setSignInHover={setSignInHover}
              setAnchorEl={setAnchorEl}
              handleSignOut={handleSignOut}
            />

            {/* Sign In Popover */}
            <Popover
              open={openSignIn}
              anchorEl={anchorEl}
              onClose={() => { setOpenSignIn(false); setAnchorEl(null); }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              PaperProps={{
                onMouseEnter: () => setSignInHover(true),
                onMouseLeave: () => { setSignInHover(false); setOpenSignIn(false); setAnchorEl(null); },
                sx: { 
                  p: 3, 
                  minWidth: 350,
                  borderRadius: 2,
                  boxShadow: 3
                }
              }}
            >
              <SignIn />
            </Popover>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, bgcolor: 'background.default' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Box>

            {/* Footer */}
            <Footer />
          </Box>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
