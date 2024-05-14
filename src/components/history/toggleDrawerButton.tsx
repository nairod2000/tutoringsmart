// components/ToggleDrawerButton.tsx

import React, { useState } from 'react';
import { useDrawer } from '../../context/drawerContext';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

const ToggleDrawerButton: React.FC = () => {
  const { isOpen, toggleDrawer } = useDrawer();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      toggleDrawer();
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <>
      {/* Small screens: Part of the navbar */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Small screens: Close icon near the drawer */}
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '16px',
            left: '250px',
            zIndex: 1300,
            display: { s: 'block', md: 'none' },
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Large screens: Center of MessageContainer height */}
      <Box
        sx={{
          position: 'fixed',
          left: isOpen ? '250px' : '0px', // Adjust based on drawer state
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1300, // Ensure it appears above other elements
          display: { xs: 'none', md: 'block' },
        }}
      >
        <IconButton 
          onClick={handleClick}
          sx={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 0.3s',
          }}>
           {isOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
        </IconButton>
      </Box>
    </>
  );
};

export default ToggleDrawerButton;
