import { Typography, Container, Box, TextField, Button } from '@mui/material';
import CryptoJS from 'crypto-js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.jsx';
import { request } from '../utils/request.js';

export default function Login() {
  const [loginError, setLoginError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const doLogin = () => {
    const hashedPassword = CryptoJS.SHA512(password).toString();
    request({ method: 'get', uri: `/users?email=${email}&password=${hashedPassword}`, auth: false })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('jwtToken', response.data.token);
          navigate('/');
        } else {
          setLoginError(true);
        }
      })
      .catch(() => setLoginError(true));
  };

  return (
    <Header>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Login
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
          {loginError ? (
            <Typography color="error" sx={{ mx: 'auto' }}>
              Wrong username or password
            </Typography>
          ) : null}
          <TextField
            value={email}
            id="email"
            label="Email"
            type="text"
            error={loginError}
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginError(false);
            }}
            required
          />
          <TextField
            value={password}
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            error={loginError}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError(false);
            }}
            required
          />
          <Button variant="contained" size="large" onClick={doLogin}>
            Login
          </Button>
        </Box>
      </Container>
    </Header>
  );
}
