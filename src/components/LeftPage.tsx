import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const LeftPage = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    number: number;
    url?: string;
    isMobileView: boolean;
  }
>((props, ref) => {
  const { width, height } = useSelector(
    (state: { book: BookStateInitState }) => state.book
  );

  console.log("isMobile view in left page" + props.isMobileView);
  return (
    <div style={{ display: "flex", flexDirection: "row" }} ref={ref}>
      <Box
        sx={{
          height: height,
          width: width,
          bgcolor: "rgba(255,255,255,1)",
          boxShadow: "inset -10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Subtle shadow
          borderRadius: props.isMobileView
            ? "none"
            : "18% 18% 18% 10% / 0% 2% 2% 0%",
          backgroundImage: `url(${props.number}.png)`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",

          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          position: "relative", 
          overflow: "hidden", 
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgb(216, 132, 29)", 
            zIndex: 10,
            borderRadius: "100px",
            height:"0.7rem",
            width:"0.7rem",
            padding:'0.2rem',
            color:"black",
            fontWeight:"bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize:"0.5rem",
            mb:0.5,
            mr:0.5
          }}
        >
          {props.number}
        </Box>
      </Box>
    </div>
  );
});

export default LeftPage;
