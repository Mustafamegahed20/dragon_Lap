import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api';
import { useCart } from '../CartContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import MonitorIcon from '@mui/icons-material/Monitor';
import WeightIcon from '@mui/icons-material/FitnessCenter';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const prod = await getProduct(id);
      setProduct(prod);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Main Product Card */}
        <Paper 
          elevation={8}
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            position: 'relative'
          }}
        >
          {/* Stock Badge */}
          <Chip 
            label={product.stock === 0 ? "Out of Stock" : "In Stock"} 
            color={product.stock === 0 ? "error" : "success"} 
            sx={{ 
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 2,
              py: 1,
              borderRadius: 3
            }} 
          />

          {/* Product Image */}
          <Box sx={{ p: 4, pb: 2 }}>
            <Paper 
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {product.image ? (
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    p: 2
                  }}
                />
              ) : (
                <ComputerIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.5 }} />
              )}
            </Paper>
          </Box>

          {/* Product Info */}
          <Box sx={{ p: 4, pt: 2 }}>
            {/* Product Name */}
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              {product.name}
            </Typography>

            {/* Description */}
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                fontSize: '1rem',
                lineHeight: 1.6
              }}
            >
              {product.description || 'Premium laptop with advanced features and exceptional performance.'}
            </Typography>

            {/* Price */}
            <Paper 
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)',
                border: '2px solid',
                borderColor: 'primary.light',
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                Price
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 900, 
                  color: 'primary.main',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                EGP {product.price.toLocaleString()}
              </Typography>
            </Paper>

            {/* Technical Specifications */}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
                color: 'text.primary'
              }}
            >
              Technical Specifications
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {product.cpu && (
                <Paper 
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: 'primary.light',
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, #ffffff 100%)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ComputerIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Processor
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                        {product.cpu}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {product.ram && (
                <Paper 
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: 'success.light',
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, #ffffff 100%)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <MemoryIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Memory
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                        {product.ram}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {product.storage && (
                <Paper 
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: 'warning.light',
                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, #ffffff 100%)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'warning.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <StorageIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Storage
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                        {product.storage}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {product.screen_size && (
                <Paper 
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: 'secondary.light',
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.05) 0%, #ffffff 100%)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <MonitorIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Display
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                        {product.screen_size}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {product.battery && (
                <Paper 
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: 'error.light',
                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, #ffffff 100%)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <BatteryChargingFullIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Battery
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                        {product.battery}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Add to Cart Button */}
            <Button 
              variant="contained" 
              size="large"
              fullWidth
              onClick={() => handleAddToCart(product)}
              startIcon={<span>🛒</span>}
              sx={{ 
                py: 3,
                px: 4,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 4,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(25, 118, 210, 0.5)'
                }
              }}
            >
              Add to Cart - EGP {product.price.toLocaleString()}
            </Button>
          </Box>
        </Paper>
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
          "{product.name}" added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails; 