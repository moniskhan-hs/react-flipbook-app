import { Box, CircularProgress } from '@mui/material'

const Loader = () => {
  return (
    <Box
    sx={{
        width:"100vw",
        height:"100vh",
        overflow:"hidden",
        display:'flex',
        justifyContent:"center",
        alignItems:"center"
    }}
    
    >
      <CircularProgress/>
    </Box>
  )
}

export default Loader
