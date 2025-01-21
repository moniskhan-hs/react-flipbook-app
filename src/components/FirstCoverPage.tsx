import { Box, Stack } from "@mui/material";
import React from "react";

const FirstCoverPage = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode;
    isMobileView:boolean 

   }
>((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="">
      {/* ----------------------------- main cover page------------------------- */}
      <Stack
        className="page-content"
        style={{
          backgroundColor: "gray",
          height: "100%",
          width: props.isMobileView?'100%':"120%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // borderTopRightRadius: 10,
          // borderBottomRightRadius: 10,
          // backgroundImage:`url(/1.png)`,
          // backgroundPosition:"center",
          // backgroundSize: '100% 100%',
          // backgroundRepeat:"no-repeat",
          // padding:"2rem"
        }}
      >
        <Box>
          <h2 style={{
            fontSize:"0.7rem"
          }}>{props.children}</h2>

          {/* <Typography>to my Book</Typography> */}
        </Box>
      </Stack>
    </div>
  );
});

export default FirstCoverPage