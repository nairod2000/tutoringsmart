'use client'
import Chat from "../../../../components/chat/chat";
import useAuthProtection from "../../../../hooks/useAuthProtection";
import { Box, CircularProgress } from "@mui/material";


export default function Session({ params }) {
  const authLoading = useAuthProtection();

  if (authLoading) {
    return ( 
      <Box sx={{ display: 'flex', height: 'calc(100vh - var(--navbar-height))', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Chat topic={params.topic} />
    </>
  )
}