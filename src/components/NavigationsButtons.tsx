import { Box, Button, Stack } from "@mui/material";
import React from "react";

type Props = {
  currentPage: number;
  flipBookRef: React.MutableRefObject<undefined>;
};

const NavigationsButtons = ({ currentPage, flipBookRef }: Props) => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-around"}
      alignItems={"center"}
    >
      <Button
        variant="contained"
        disabled={currentPage == 0}
        sx={{
          textTransform: "none",
          "&.Mui-disabled": {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgba(252, 252, 252, 0.78)",
            opacity: "0.5",
            cursor: "not-allowed",
            pointerEvents: "none",
          },
        }}
        /* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */
        onClick={() => flipBookRef.current.pageFlip().flipPrev()}
      >
        {" "}
        Prev
      </Button>
      <Box
        mx={2}
        sx={{
          fontWeight: "bold",
          color: "orange",
        }}
      >
        {currentPage + 2} / 10
      </Box>
      <Button
        variant="contained"
        disabled={currentPage + 2 >= 10}
        /* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */
        onClick={() => flipBookRef.current.pageFlip().flipNext()}
        sx={{
          textTransform: "none",
          "&.Mui-disabled": {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgba(252, 252, 252, 0.78)",
            opacity: "0.5",
            cursor: "not-allowed",
            pointerEvents: "none",
          },
        }}
      >
        Next
      </Button>
    </Stack>
  );
};

export default NavigationsButtons;
