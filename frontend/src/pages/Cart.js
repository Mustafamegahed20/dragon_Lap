import React from 'react';
import { useCart } from '../CartContext';
// Removed unused table imports to satisfy linter
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyCartIcon from '@mui/icons-material/RemoveShoppingCart';

const Cart = () => {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Enhanced Empty Cart Component
  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card 
          elevation={3} 
          sx={{ 
            borderRadius: 4, 
            textAlign: 'center', 
            py: 8, 
            px: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          <CardContent>
            <Box sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: 'primary.main',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                }}
              >
                <EmptyCartIcon sx={{ fontSize: 60 }} />
              </Avatar>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: 'text.primary',
                  background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Your Cart is Empty
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
              >
                Looks like you haven't added any laptops to your cart yet. 
                Start exploring our premium collection!
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                startIcon={<ShoppingBagIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
              >
                Browse Laptops
              </Button>
              
              <Button
                component={Link}
                to="/"
                variant="outlined"
                size="large"
                startIcon={<ArrowBackIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              >
                Back to Home
              </Button>
            </Box>

            {/* Feature highlights */}
            <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Why Shop with Dragon Lap?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip 
                  label="Free Shipping" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontSize: '0.9rem', py: 2 }} 
                />
                <Chip 
                  label="24/7 Support" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontSize: '0.9rem', py: 2 }} 
                />
                <Chip 
                  label="Premium Quality" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontSize: '0.9rem', py: 2 }} 
                />
                <Chip 
                  label="Best Prices" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontSize: '0.9rem', py: 2 }} 
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Shopping Cart
        </Typography>
        <Chip 
          label={`${cart.length} item${cart.length !== 1 ? 's' : ''}`}
          color="primary"
          sx={{ ml: 2 }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Cart Items */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {cart.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                    {/* Product Image Placeholder */}
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.light',
                        fontSize: '2rem',
                      }}
                    >
                      💻
                    </Avatar>

                    {/* Product Info */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Premium laptop with advanced features
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                        EGP {item.price.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Quantity Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                        disabled={item.qty <= 1}
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      
                      <TextField
                        size="small"
                        value={item.qty}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          updateQty(item.id, Math.max(1, value));
                        }}
                        inputProps={{
                          min: 1,
                          style: { textAlign: 'center', width: '60px' }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Item Total */}
                    <Box sx={{ minWidth: 120, textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        EGP {(item.price * item.qty).toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Remove Button */}
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.light',
                          color: 'white',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  {index < cart.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          {/* Clear Cart Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<DeleteIcon />}
              onClick={clearCart}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
              }}
            >
              Clear Cart
            </Button>
          </Box>
        </Box>

        {/* Order Summary */}
        <Box sx={{ width: { xs: '100%', lg: 350 } }}>
          <Card elevation={3} sx={{ borderRadius: 3, position: 'sticky', top: 24 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    EGP {total.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Shipping:</Typography>
                  <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>
                    {total >= 10000 ? 'Free' : 'EGP 200'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Tax (14%):</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    EGP {Math.round(total * 0.14).toLocaleString()}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    EGP {Math.round(total * 1.14 + (total >= 10000 ? 0 : 200)).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {total < 10000 && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Add EGP {(10000 - total).toLocaleString()} more for free shipping!
                  </Typography>
                </Box>
              )}

              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                Proceed to Checkout
              </Button>
              
              <Button
                component={Link}
                to="/products"
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart; 