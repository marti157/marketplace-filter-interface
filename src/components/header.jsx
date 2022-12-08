import { AppBar, CssBaseline, Container, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import config from '../../config.js';
import theme from '../style/theme.js';

export default function Header(props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Container>
          <Typography variant="h5" color="inherit" sx={{ my: 3 }} noWrap>
            {config.TITLE}
          </Typography>
        </Container>
      </AppBar>
      <Container sx={{ my: 4 }}>{props.children}</Container>
    </ThemeProvider>
  );
}
