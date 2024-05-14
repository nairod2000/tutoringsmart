import { Box } from '@mui/material';
import { useDrawer } from '../../context/drawerContext';

export default function HistoryDrawer() {
  const { isOpen } = useDrawer();

  const drawerStyle = {
    position: 'fixed',
    left: isOpen ? 0 : '-250px',  // This ensures it moves off-screen when not open
    top: 0,
    bottom: 0,
    width: '250px',
    bgcolor: '#f5f5f5',
    zIndex: 1200,  // High zIndex to ensure it overlays other content
    boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
    transition: 'left 0.3s',  // Smooth sliding effect
    '@media (max-width: 900px)': {
      zIndex: 1300, // Even higher zIndex for smaller screens to overlay content
    }
  };

  return (
    <Box sx={drawerStyle}>
      <div>Content</div>
    </Box>
  );
}
