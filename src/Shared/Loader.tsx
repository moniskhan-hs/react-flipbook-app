import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const Loader = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = ["Loading...", "Almost there...", "Finishing up..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [messages.length]);


  return (
    <Box
    sx={{
        width:"100vw",
        height:"100vh",
        overflow:"hidden",
        display:'flex',
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"column"
    }}
    
    >
     {/* MUI Spinner */}
     <CircularProgress size={64} color="primary" />
      {/* Dynamic Message */}
      <Typography variant="h6" mt={2} color="textSecondary">
        {messages[messageIndex]}
      </Typography>
    </Box>
  )
}

export default Loader
