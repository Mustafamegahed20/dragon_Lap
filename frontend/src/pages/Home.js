import React, { useEffect, useState } from 'react';
import { getCategories } from '../api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import DellLogo from '../assets/Dell_Logo.png';
import HPLogo from '../assets/HP.png';
import AcerLogo from '../assets/Acer-Logo.png';
import MainLogo from '../assets/logo.jpg';
import LenovoLogo from '../assets/Lenovo.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const laptopImg = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80';

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(cats => {
      // Remove duplicates and sort categories
      const uniqueCategories = cats.filter((cat, index, arr) => 
        arr.findIndex(c => c.name === cat.name) === index
      ).sort((a, b) => a.name.localeCompare(b.name));
      setCategories(uniqueCategories);
    });
  }, []);

  const features = [
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Quality Guaranteed',
      description: 'All laptops come with manufacturer warranty and quality assurance'
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Free Shipping',
      description: 'Free delivery on orders over 10000 EGP with express shipping options'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Expert customer support available round the clock for assistance'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Payment',
      description: 'Multiple secure payment options with buyer protection guarantee'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '70vh' },
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${laptopImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 600 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                color: '#ffd700', // Golden yellow color
                background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Premium Laptops for Every Need
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                color: '#e3f2fd', // Light blue color
                fontWeight: 500,
              }}
            >
              Discover cutting-edge technology with unbeatable performance, quality, and value
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Shop Now
              </Button>
              <Button
                component={Link}
                to="/about"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Why Choose Dragon Lap?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          We're committed to providing exceptional value and service that exceeds your expectations
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Shop by Brand
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Explore laptops from the world's leading technology brands
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {categories.slice(0, 4).map(cat => {
              let imgSrc = MainLogo;
              if (/dell/i.test(cat.name)) imgSrc = DellLogo;
              else if (/hp/i.test(cat.name)) imgSrc = HPLogo;
              else if (/acer/i.test(cat.name)) imgSrc = AcerLogo;
              else if (/lenovo/i.test(cat.name)) imgSrc = LenovoLogo;

              return (
                <Grid item xs={6} sm={6} md={3} key={cat.name}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      minHeight: 280,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      to={`/products?category=${cat.id}`}
                      sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mb: 2,
                          height: 120,
                          flex: 1,
                        }}
                      >
                        <img
                          src={imgSrc}
                          alt={cat.name}
                          style={{
                            maxWidth: '80%',
                            maxHeight: '80%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                      <CardContent sx={{ textAlign: 'center', pt: 0, pb: '16px !important' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {cat.name}
                        </Typography>
                        <Chip
                          label="View Products"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Ready to Upgrade Your Technology?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Join thousands of satisfied customers who trust Dragon Lap for their computing needs
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 