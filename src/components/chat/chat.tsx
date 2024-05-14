import { Box } from '@mui/material';
import InputBar from './inputBar';
import MessageContainer from './messageContainer';
import { DrawerProvider, useDrawer } from '../../context/drawerContext'
import HistoryDrawer from '../history/historyDrawer';
import Navbar from '../navbar/navbar';
import { StateContextProvider } from '../../context/historyContext';

export default function Chat() {
  return (
    <DrawerProvider>
      <StateContextProvider>
        <Navbar />
        <HistoryDrawer/>
        <ChatContent/>
      </StateContextProvider>
    </DrawerProvider>
  );
};

function ChatContent() {
  const { isOpen } = useDrawer();
  const sxStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // Ensures it takes up all available space
    padding: '20px',
    paddingBottom: '0px',
    marginLeft: isOpen ? '250px' : '0px', // Adjust based on drawer state
    transition: 'margin-left 0.3s',
    '@media (max-width: 900px)': {
      marginLeft: '0px',
    },
    height: 'calc(100vh - 84px)', // Set the height to full viewport height
    overflow: 'hidden', // Prevents any overflow outside the component
  };

  return (
    <Box sx={sxStyle}>
      <MessageContainer />
      <InputBar />
    </Box>
  );
}