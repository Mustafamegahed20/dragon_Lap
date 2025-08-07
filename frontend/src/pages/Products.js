import React, { useEffect, useState } from 'react';
import { getCategories, getProducts } from '../api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const blue = '#6fd6ff'; // Match screenshot blue

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search') || '';
    const categoryParam = urlParams.get('category') || '';
    
    setSearchQuery(searchParam);
    setSelectedCategory(categoryParam);
  }, [location.search]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError('');
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Enhanced filtering logic
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category_id === parseInt(selectedCategory)
      );
    }
    
    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.discount_price || product.price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }
    
    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          const priceA = a.discount_price || a.price;
          const priceB = b.discount_price || b.price;
          return priceA - priceB;
        case 'priceDesc':
          const priceDescA = a.discount_price || a.price;
          const priceDescB = b.discount_price || b.price;
          return priceDescB - priceDescA;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    navigate(`/products?${params.toString()}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductName(product.name);
    setSnackbarOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange('');
    setSortBy('name');
    navigate('/products');
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : '';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading products...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Header Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 6,
          mb: 4
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            {selectedCategory ? `${getCategoryName(selectedCategory)} Laptops` : 'Premium Laptops Collection'}
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9, mb: 3 }}>
            Discover cutting-edge technology with unbeatable performance and quality
          </Typography>
          
          {/* Breadcrumbs */}
          <Breadcrumbs 
            sx={{ 
              justifyContent: 'center', 
              display: 'flex',
              '& .MuiBreadcrumbs-ol': { justifyContent: 'center' }
            }}
            separator={<Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>›</Typography>}
          >
            <Link component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
              Home
            </Link>
            <Typography sx={{ color: 'white', fontWeight: 500 }}>Products</Typography>
            {selectedCategory && (
              <Typography sx={{ color: 'white', fontWeight: 500 }}>
                {getCategoryName(selectedCategory)}
              </Typography>
            )}
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 4 }}>
        {/* Search and Filters Section */}
        <Box sx={{ mb: 4 }}>

          {/* Search Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 4,
                maxWidth: 700,
                width: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <TextField
                fullWidth
                placeholder="Search laptops by name, brand, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    '& fieldset': { border: 'none' },
                    fontSize: '1.1rem'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchQuery('')} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ 
                  ml: 2, 
                  px: 3, 
                  py: 1.5, 
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory) && (
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => setSearchQuery('')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Category: ${getCategoryName(selectedCategory)}`}
                  onDelete={() => setSelectedCategory('')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              <Button
                size="small"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                sx={{ ml: 1 }}
              >
                Clear All
              </Button>
            </Box>
          )}
        </Box>

        {/* Filters and Sort */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters & Sort
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{ ml: 'auto' }}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </Box>

          {showFilters && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={priceRange}
                  label="Price Range"
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <MenuItem value="">All Prices</MenuItem>
                  <MenuItem value="0-10000">Under EGP 10,000</MenuItem>
                  <MenuItem value="10000-20000">EGP 10,000 - 20,000</MenuItem>
                  <MenuItem value="20000-50000">EGP 20,000 - 50,000</MenuItem>
                  <MenuItem value="50000">Over EGP 50,000</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Showing {filteredProducts.length} of {products.length} products
            </Typography>
            
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or browse all products.
            </Typography>
            <Button variant="contained" onClick={clearFilters}>
              Show All Products
            </Button>
          </Paper>
        )}

        {/* Product Grid */}
        <Grid container spacing={3} justifyContent="center">
          {filteredProducts.map(product => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={4} 
              xl={4} 
              key={product.id} 
              sx={{ 
                display: 'flex',
                '@media (min-width: 1200px)': {
                  maxWidth: '33.333%',
                  flexBasis: '33.333%'
                }
              }}
            >
              <Card 
                elevation={3}
                sx={{ 
                  width: '100%',
                  minHeight: 580,
                  height: 580,
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 4, 
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main',
                    '& .product-image': {
                      transform: 'scale(1.05)',
                    },
                    '& .product-price': {
                      color: 'primary.main',
                    }
                  },
                }}
              >
                {/* Stock Status Badge */}
                <Chip 
                  label={product.stock === 0 ? "Out of Stock" : "In Stock"} 
                  color={product.stock === 0 ? "error" : "success"} 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    left: 12, 
                    zIndex: 2, 
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }} 
                />
                
                {/* Product Image */}
                {product.image ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    className="product-image"
                    sx={{ 
                      objectFit: 'contain', 
                      background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)', 
                      p: 3,
                      transition: 'transform 0.4s ease',
                      minHeight: 200,
                      maxHeight: 200,
                    }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 200,
                      minHeight: 200,
                      maxHeight: 200, 
                      background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem'
                    }}
                  >
                    💻
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      minHeight: 40,
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.description || 'Premium laptop with advanced features'}
                  </Typography>
                  
                  {/* Specifications */}
                  <Box sx={{ mb: 2 }}>
                    {product.cpu && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <ComputerIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          {product.cpu}
                        </Typography>
                      </Box>
                    )}
                    {product.ram && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <MemoryIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          {product.ram}
                        </Typography>
                      </Box>
                    )}
                    {product.storage && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <StorageIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          {product.storage}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Price Display */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 2,
                      mb: 3,
                      bgcolor: 'rgba(25, 118, 210, 0.05)',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'rgba(25, 118, 210, 0.1)'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      className="product-price"
                      sx={{ 
                        fontWeight: 700, 
                        color: product.discount_price ? 'success.main' : 'text.primary',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      EGP {(product.discount_price || product.price).toLocaleString()}
                    </Typography>
                    {product.discount_price && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary', 
                          textDecoration: 'line-through' 
                        }}
                      >
                        EGP {product.price.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions sx={{ p: 3, gap: 2, bgcolor: 'rgba(248, 250, 252, 0.5)', minHeight: '80px', mt: 'auto' }}>
                  <Button 
                    component={RouterLink} 
                    to={`/products/${product.id}`} 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      flex: 1,
                      borderRadius: 3,
                      fontWeight: 600,
                      textTransform: 'none',
                      py: 1.5,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <IconButton 
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    sx={{ 
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      p: 1.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        transform: 'translateY(-2px) scale(1.1)',
                        boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
                      }
                    }}
                  >
                    <ShoppingCartIcon fontSize="medium" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          "{addedProductName}" added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products; 