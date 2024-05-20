import React, {useState} from 'react';
import Link from 'next/link';
import { AppBar, Typography, Button, Toolbar, Menu, MenuItem } from '@mui/material';
import ToggleDrawerButton from '../history/toggleDrawerButton';
import { logout } from '../../services/authServices';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    logout();
    router.replace('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ToggleDrawerButton />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Tutoring Smart
          </Link>
        </Typography>
        <Button color="inherit" onClick={handleClick}>Settings</Button>
        <Menu
          id='settings-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleSignout}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
