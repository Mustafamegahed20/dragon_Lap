import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import SupportIcon from '@mui/icons-material/Support';
import SecurityIcon from '@mui/icons-material/Security';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const faqCategories = [
    { id: 'all', label: 'All Questions', icon: <HelpOutlineIcon />, color: 'primary' },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <ShippingIcon />, color: 'info' },
    { id: 'payment', label: 'Payment & Pricing', icon: <PaymentIcon />, color: 'success' },
    { id: 'returns', label: 'Returns & Refunds', icon: <InventoryIcon />, color: 'warning' },
    { id: 'support', label: 'Technical Support', icon: <SupportIcon />, color: 'error' },
    { id: 'security', label: 'Security & Privacy', icon: <SecurityIcon />, color: 'secondary' },
  ];

  const faqData = [
    {
      id: 1,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'Our return policy allows returns within 30 days of purchase for manufacturing defects only. Products must be in original condition and packaging with all accessories, documentation, and original packaging included. Returns for reasons other than manufacturing defects are not accepted. Refunds will be processed within 5-7 business days after we receive and inspect the returned item.',
    },
    {
      id: 2,
      category: 'shipping',
      question: 'Do you offer international shipping?',
      answer: 'Currently, we offer shipping only within Egypt. We provide nationwide delivery with free shipping on orders over EGP 10,000. Same-day delivery is available in Cairo and Alexandria for orders placed before 2 PM.',
    },
    {
      id: 3,
      category: 'support',
      question: 'How can I track my order?',
      answer: 'After placing an order, you will receive an email confirmation with your order number. You can track your order status on our website by entering the order number in the order tracking section. You will also receive SMS updates about your delivery status.',
    },
    {
      id: 4,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards (Visa, Mastercard), cash on delivery, bank transfers, and mobile wallet payments (Vodafone Cash, Orange Money, Etisalat Cash). All online payments are secured with SSL encryption.',
    },
    {
      id: 5,
      category: 'shipping',
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-5 business days depending on your location. Express delivery (1-2 days) is available for an additional fee. Same-day delivery is available in Cairo and Alexandria for orders placed before 2 PM.',
    },
    {
      id: 6,
      category: 'support',
      question: 'Do you provide technical support for laptops?',
      answer: 'Yes, we provide comprehensive technical support including setup assistance, software installation guidance, and troubleshooting. Our support team is available 24/7 via phone, email, or live chat. We also offer on-site support for business customers.',
    },
    {
      id: 7,
      category: 'security',
      question: 'Is my personal information secure?',
      answer: 'Absolutely. We use enterprise-grade security measures to protect your personal and payment information. All data is encrypted using SSL technology, and we comply with international data protection standards. We never share your information with third parties.',
    },
    {
      id: 8,
      category: 'payment',
      question: 'Do you offer installment plans?',
      answer: 'Currently, we do not offer installment plans, but we are working on implementing this feature in the future. For now, we accept full payment through various methods including credit/debit cards, cash on delivery, bank transfers, and mobile wallet payments.',
    },
    {
      id: 9,
      category: 'returns',
      question: 'Can I exchange a laptop for a different model?',
      answer: 'Yes, exchanges are possible within 30 days of purchase if the laptop is in original condition. The price difference will be refunded or charged accordingly. Exchange requests must be initiated through our customer service team.',
    },
    {
      id: 10,
      category: 'support',
      question: 'Do you offer warranty on laptops?',
      answer: 'Yes, all laptops come with a 3-month warranty that covers manufacturing defects only. This warranty does not cover physical damage, software issues, or damage caused by misuse. Any manufacturing defects discovered within this period will be repaired or replaced free of charge.',
    },
  ];

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '2.5rem',
              }}
            >
              <HelpOutlineIcon sx={{ fontSize: '2.5rem' }} />
            </Avatar>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Find answers to common questions about our laptops, services, and policies
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Search and Filter Section */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Filter by category:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {faqCategories.slice(0, 3).map((category) => (
                  <Chip
                    key={category.id}
                    label={category.label}
                    onClick={() => setSelectedCategory(category.id)}
                    color={selectedCategory === category.id ? category.color : 'default'}
                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Category Filter Chips */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Browse by Category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {faqCategories.map((category) => (
              <Chip
                key={category.id}
                icon={category.icon}
                label={category.label}
                onClick={() => setSelectedCategory(category.id)}
                color={selectedCategory === category.id ? category.color : 'default'}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                sx={{
                  py: 2,
                  px: 1,
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === category.id ? 600 : 400,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* FAQ Accordions */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {selectedCategory === 'all' ? 'All Questions' : 
               faqCategories.find(cat => cat.id === selectedCategory)?.label}
            </Typography>
            <Chip
              label={`${filteredFAQs.length} question${filteredFAQs.length !== 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {filteredFAQs.length === 0 ? (
            <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No questions found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms or browse different categories.
              </Typography>
            </Paper>
          ) : (
            filteredFAQs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expanded === `panel${faq.id}`}
                onChange={handleAccordionChange(`panel${faq.id}`)}
                elevation={1}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    boxShadow: 3,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    '&.Mui-expanded': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={faqCategories.find(cat => cat.id === faq.category)?.label}
                      size="small"
                      color={faqCategories.find(cat => cat.id === faq.category)?.color}
                      variant="outlined"
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {faq.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: 'background.default' }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        {/* Contact Support Section */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <ContactSupportIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Still need help?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Can't find the answer you're looking for? Our customer support team is here to help you 24/7.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/contact"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                }}
              >
                Contact Support
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => window.open('https://wa.me/201060461071?text=Hello%20Dragon%20Lap!%20I%20need%20help%20with%20a%20question.', '_blank')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                }}
              >
                WhatsApp Chat
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>01060461071</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>support@dragonlap.com</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Hours</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>24/7 Support</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default FAQ; 