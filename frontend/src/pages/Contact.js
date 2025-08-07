import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors.name = 'Name should only contain letters and spaces';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'mobile':
        if (!value) {
          newErrors.mobile = 'Mobile number is required';
        } else if (!/^[0-9+\-\s()]+$/.test(value)) {
          newErrors.mobile = 'Please enter a valid mobile number';
        } else if (value.replace(/[^0-9]/g, '').length < 10) {
          newErrors.mobile = 'Mobile number must be at least 10 digits';
        } else {
          delete newErrors.mobile;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.trim().length < 10) {
          newErrors.message = 'Message must be at least 10 characters';
        } else {
          delete newErrors.message;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    const isValid = Object.keys(form).every(key => validateField(key, form[key]));
    
    if (!isValid) {
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon color="primary" />,
      title: 'Visit Our Store',
      details: ['Cairo, Egypt', 'Downtown Technology Center'],
    },
    {
      icon: <PhoneIcon color="primary" />,
      title: 'Call Us',
      details: ['01060461071', 'Available 24/7'],
    },
    {
      icon: <EmailIcon color="primary" />,
      title: 'Email Us',
      details: ['info@dragonlap.com', 'support@dragonlap.com'],
    },
    {
      icon: <AccessTimeIcon color="primary" />,
      title: 'Business Hours',
      details: ['Mon - Fri: 9AM - 6PM', 'Sat - Sun: 10AM - 4PM'],
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            Get in Touch
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Have questions about our laptops? We're here to help you find the perfect computing solution.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={3}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} sm={6} md={12} key={index}>
                    <Card elevation={2} sx={{ height: '100%', borderRadius: 3 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ mt: 0.5 }}>
                            {info.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {info.title}
                            </Typography>
                            {info.details.map((detail, idx) => (
                              <Typography key={idx} variant="body2" color="text.secondary">
                                {detail}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* WhatsApp CTA */}
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mt: 3, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white'
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Quick WhatsApp Support
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                  Get instant answers to your questions
                </Typography>
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#25D366',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  onClick={() => window.open('https://wa.me/201060461071?text=Hello%20Dragon%20Lap!%20I%20need%20help%20with%20choosing%20a%20laptop.', '_blank')}
                >
                  Chat Now
                </Button>
              </Paper>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              {submitted ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                    Message Sent Successfully!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Thank you for contacting Dragon Lap. Our team will get back to you within 24 hours.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', mobile: '', message: '' });
                      setErrors({});
                    }}
                  >
                    Send Another Message
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    Send us a Message
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Fill out the form below and we'll respond as soon as possible.
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Full Name"
                          value={form.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="email"
                          type="email"
                          label="Email Address"
                          value={form.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="mobile"
                          type="tel"
                          label="Mobile Number"
                          value={form.mobile}
                          onChange={handleChange}
                          error={!!errors.mobile}
                          helperText={errors.mobile}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="message"
                          label="Your Message"
                          multiline
                          rows={4}
                          value={form.message}
                          onChange={handleChange}
                          error={!!errors.message}
                          helperText={errors.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                <MessageIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading || Object.keys(errors).length > 0}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            position: 'relative',
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'Send Message'
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact; 