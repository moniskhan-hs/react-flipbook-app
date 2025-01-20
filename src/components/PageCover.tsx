import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const PageCover = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      {/* ----------------------------- last cover page------------------------- */}
      <Stack
        className="page-content"
        style={{
          backgroundColor: "gray",
          height: "100%",
          width: "120%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // borderTopLeftRadius: 10,
          // borderBottomLeftRadius: 10,
        }}
      >
        <Box>
          <h2 style={{
            fontSize:"0.7rem"
          }}>{props.children}</h2>

        </Box>
      </Stack>
    </div>
  );
});


export default PageCover