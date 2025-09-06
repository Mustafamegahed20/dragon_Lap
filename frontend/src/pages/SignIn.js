import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(errors);
    return !errors[name];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validate all fields
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);

    if (!emailValid || !passwordValid) {
      setLoading(false);
      return;
    }

    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      
      // Redirect to admin if user is admin, otherwise home
      setTimeout(() => {
        if (data.user.is_admin) {
          window.location = '/admin';
        } else {
          window.location = '/';
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your Dragon Lap account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              Login successful! Redirecting...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || Object.keys(fieldErrors).length > 0}
              sx={{
                mt: 3,
                mb: 2,
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
                'Sign In'
              )}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
              <Link
                href="#"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot your password?
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignIn; 