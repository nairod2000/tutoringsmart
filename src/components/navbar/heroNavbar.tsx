import React from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function HeroNavbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Tutoring Smart
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href="#features" passHref>
            <Button color="inherit">Features</Button>
          </Link>
          <Link href="#about" passHref>
            <Button color="inherit">About</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button variant="contained" color="primary">Sign Up</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}