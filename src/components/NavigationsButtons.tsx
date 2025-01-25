import { Box, Button, Stack } from "@mui/material";
import React from "react";

type Props = {
  currentPage: number;
  flipBookRef: React.MutableRefObject<undefined>;
  coverColor:string | undefined;
  spineColor :string | undefined;
  totalPage:number | undefined

};

const NavigationsButtons = ({ currentPage, flipBookRef,coverColor,spineColor ,totalPage}: Props) => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-around"}
      alignItems={"center"}
      mt={1}
    >
      <Button
        variant="contained"
        disabled={currentPage == 0}
        sx={{
          textTransform: "none",
          bgcolor:coverColor,
          color: spineColor,
          "&.Mui-disabled": {
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
          fontWeight: "bolder",
          color: coverColor,
          fontSize:'1.3rem'
        }}
      >
        {currentPage + 2} / {totalPage}
      </Box>
      <Button
        variant="contained"
        disabled={currentPage + 2 >= totalPage!}
        /* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */
        onClick={() => flipBookRef.current.pageFlip().flipNext()}
        sx={{
          textTransform: "none",
          bgcolor:coverColor,
          color: spineColor,
          "&.Mui-disabled": {
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
