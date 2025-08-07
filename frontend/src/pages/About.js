import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import LaptopIcon from '@mui/icons-material/Laptop';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

const About = () => {
  const achievements = [
    { number: '10,000+', label: 'Happy Customers', icon: <GroupIcon /> },
    { number: '5,000+', label: 'Laptops Sold', icon: <LaptopIcon /> },
    { number: '50+', label: 'Brand Partners', icon: <BusinessIcon /> },
    { number: '99%', label: 'Customer Satisfaction', icon: <StarIcon /> },
  ];

  const values = [
    {
      icon: <WorkspacePremiumIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Premium Quality',
      description: 'We only offer laptops from trusted brands with verified quality and performance standards.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Shopping',
      description: 'Your data and transactions are protected with enterprise-grade security measures.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Support',
      description: '24/7 customer support from our team of technology experts and specialists.'
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over EGP 10,000 with express delivery options available.'
    },
  ];

  const milestones = [
    { year: '2018', event: 'Dragon Lap founded with a vision to democratize technology access' },
    { year: '2019', event: 'Partnered with major brands: HP, Dell, Lenovo, and Acer' },
    { year: '2020', event: 'Launched online platform and expanded delivery network' },
    { year: '2021', event: 'Reached 5,000+ satisfied customers milestone' },
    { year: '2022', event: 'Introduced premium laptop series and business solutions' },
    { year: '2023', event: 'Expanded to serve all of Egypt with same-day delivery' },
    { year: '2024', event: 'Leading laptop retailer with 10,000+ happy customers' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
                About Dragon Lap
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                Egypt's premier destination for cutting-edge laptops and computing solutions. 
                We're passionate about connecting people with the perfect technology for their needs.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label="Founded 2018" color="secondary" sx={{ color: 'white', fontWeight: 600 }} />
                <Chip label="10,000+ Customers" color="secondary" sx={{ color: 'white', fontWeight: 600 }} />
                <Chip label="Nationwide Delivery" color="secondary" sx={{ color: 'white', fontWeight: 600 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: 'center',
                  '& .laptop-emoji': {
                    fontSize: '8rem',
                    animation: 'float 3s ease-in-out infinite',
                  },
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                  },
                }}
              >
                <div className="laptop-emoji">💻</div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                To empower individuals and businesses across Egypt with access to premium laptops and computing 
                technology. We believe that everyone deserves reliable, high-performance technology that enhances 
                productivity, creativity, and connects them to endless possibilities.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
                To become the most trusted and innovative laptop retailer in the Middle East, known for our 
                exceptional customer service, authentic products, and commitment to making technology accessible 
                to everyone. We envision a future where Dragon Lap is synonymous with quality and reliability.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Achievements */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2 }}>
            Our Achievements
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Numbers that reflect our commitment to excellence
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {achievements.map((achievement, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {achievement.number}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {achievement.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Values */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2 }}>
          Why Choose Dragon Lap?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          The values that drive everything we do
        </Typography>
        
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {/* First Row: Premium Quality + Secure Shopping */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            {values.slice(0, 2).map((value, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                <Card
                  elevation={2}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: 280,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ flex: '0 0 auto', mb: 3 }}>
                    {value.icon}
                  </Box>
                  <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {value.description}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
          
          {/* Second Row: Expert Support + Fast Delivery */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {values.slice(2, 4).map((value, index) => (
              <Box key={index + 2} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                <Card
                  elevation={2}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: 280,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ flex: '0 0 auto', mb: 3 }}>
                    {value.icon}
                  </Box>
                  <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {value.description}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Our Story */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2 }}>
            Our Story
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
            From a small startup to Egypt's leading laptop retailer
          </Typography>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4, color: 'text.secondary' }}>
              Dragon Lap was born from a simple observation: finding reliable, authentic laptops in Egypt was unnecessarily 
              complicated and expensive. Our founders, passionate technology enthusiasts, decided to change this by creating 
              a platform that prioritizes transparency, quality, and customer satisfaction above all else.
            </Typography>
            
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4, color: 'text.secondary' }}>
              Starting with just a small inventory and big dreams, we focused on building genuine relationships with 
              international brands and our customers. Today, we're proud to be the trusted choice for students, 
              professionals, gamers, and businesses across Egypt.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
              Our Journey Through the Years
            </Typography>
            
            {/* Timeline Layout */}
            <Box sx={{ position: 'relative', maxWidth: 800, mx: 'auto' }}>
              {/* Timeline Line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: 3,
                  bgcolor: 'primary.light',
                  transform: 'translateX(-50%)',
                  display: { xs: 'none', md: 'block' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: 12,
                    height: 12,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 12,
                    height: 12,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                  },
                }}
              />
              
              {milestones.map((milestone, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 4,
                    position: 'relative',
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    textAlign: { xs: 'center', md: index % 2 === 0 ? 'right' : 'left' },
                  }}
                >
                  {/* Content Card */}
                  <Box sx={{ flex: 1, px: { xs: 0, md: 3 } }}>
                    <Card
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        maxWidth: { xs: '100%', md: 350 },
                        mx: { xs: 'auto', md: index % 2 === 0 ? 'auto' : 0 },
                        ml: { md: index % 2 === 0 ? 'auto' : 0 },
                        mr: { md: index % 2 === 0 ? 0 : 'auto' },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          [index % 2 === 0 ? 'right' : 'left']: { xs: 'auto', md: -8 },
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                          [index % 2 === 0 ? 'borderRight' : 'borderLeft']: {
                            xs: 'none',
                            md: '8px solid white',
                          },
                          transform: 'translateY(-50%)',
                          display: { xs: 'none', md: 'block' },
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Chip
                          label={milestone.year}
                          color="primary"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            height: 32,
                            '& .MuiChip-label': {
                              px: 2,
                            },
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: 'success.main',
                            borderRadius: '50%',
                            ml: 'auto',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.6,
                          color: 'text.primary',
                          fontWeight: 500,
                        }}
                      >
                        {milestone.event}
                      </Typography>
                    </Card>
                  </Box>

                  {/* Timeline Dot */}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      border: '3px solid white',
                      boxShadow: 2,
                      position: { xs: 'static', md: 'absolute' },
                      left: { md: '50%' },
                      transform: { md: 'translateX(-50%)' },
                      zIndex: 2,
                      my: { xs: 2, md: 0 },
                      order: { xs: -1, md: 0 },
                    }}
                  />

                  {/* Spacer for desktop */}
                  <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Find Your Perfect Laptop?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Join thousands of satisfied customers who trust Dragon Lap for their computing needs. 
            Experience the difference of authentic products and exceptional service.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              Browse Laptops
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default About; 