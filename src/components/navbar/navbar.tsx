import React from 'react';
import Link from 'next/link';
import { AppBar, Typography, Button, Box, Toolbar } from '@mui/material';
import ToggleDrawerButton from '../history/toggleDrawerButton';

export default function Navbar() {

  return (
    <AppBar position="static">
      <Toolbar>
        <ToggleDrawerButton />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Tutoring Smart
          </Link>
        </Typography>
        <Button color="inherit">Settings</Button>
      </Toolbar>
    </AppBar>
  );
};
