import { Box } from "@mui/material";

const PageLoader = () => {
    return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="white"
        >
          {/* Book Loader */}
          <Box
            sx={{
              position: "relative",
              width: "60px",
              height: "45px",
              border: "4px solid gray",
              perspective: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "30px",
                height: "45px",
                border: "4px solid gray",
                borderLeft: "1px solid gray",
                position: "absolute",
                right: "-4px",
                top: "-4px",
                background: "black",
                transformOrigin: "left center",
                animation: "pageTurn 1.2s infinite",
              }}
            />
          </Box>
        
        </Box>
      );
};

export default PageLoader;
