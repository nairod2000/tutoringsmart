import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import InputBar from './inputBar';
import MessageContainer from './messageContainer';
import { DrawerProvider, useDrawer } from '../../context/drawerContext'
import HistoryDrawer from '../history/historyDrawer';
import Navbar from '../navbar/navbar';
import { StateContextProvider } from '../../context/historyContext';
import axiosInstance from '../../utils/axiosInstance';
import useAuthProtection from '../../hooks/useAuthProtection';


export default function Chat({ topic }) {
  useAuthProtection();
  
  return (
    <DrawerProvider>
      <StateContextProvider>
        <Navbar />
        <HistoryDrawer/>
        <ChatContent topic={topic} />
      </StateContextProvider>
    </DrawerProvider>
  );
};

function ChatContent({ topic }) {
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

  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axiosInstance.get('/api/materials/sm2/', {
          params: { topic: topic }
        });
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    if (topic) {
      fetchMaterials();
    }
  }, [topic]);

  return (
    <Box sx={sxStyle}>
      { materials.length > 0 && <MessageContainer material={materials} /> }
      <InputBar />
    </Box>
  );
}