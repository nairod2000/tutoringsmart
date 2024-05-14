import { Box } from "@mui/material";

export default function Message({message}) {
  return (
    <Box key={message.id} sx={{ margin: '10px 0' }}>
      <strong>{message.sender}:</strong> {message.message}
      <Box sx={{ fontSize: '0.8em', color: '#999' }}>
        {message.timestamp.toLocaleTimeString()}
      </Box>
    </Box>
  )
}