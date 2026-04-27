import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Alert } from '@mui/material';
import { AuthService } from '../services/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = AuthService.login(username, password);
    
    if (user) {
      // Reload the page to trigger authentication check in App.tsx
      window.location.reload();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            maxWidth: 400
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            TBRICKS POS System
          </Typography>
          {/* <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
            Multi-Tenant Point of Sale
          </Typography> */}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          
          {/* <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
              <strong>Default Super User Credentials:</strong>
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Username: admin
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Password: admin123
            </Typography>
          </Box> */}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
