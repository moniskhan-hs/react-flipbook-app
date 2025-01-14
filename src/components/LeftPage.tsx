import { Box, Stack } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const LeftPage = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; number: number }
>((props, ref) => {

 const {selectedSize} = useSelector((state:{book:BookStateInitState})=>state.book)



  return (
    <div style={{ display: "flex", flexDirection: "row" }} ref={ref}>
      <Box
        sx={{
          height: selectedSize?.dimensions.height,
          width: selectedSize?.dimensions.width,
          bgcolor: "rgba(255,255,255,1)",
          boxShadow: "inset -10px 0 20px -5px rgba(0, 0, 0, 0.2)",
          // Subtle shadow
          borderRadius: "18% 18% 18% 10% / 0% 2% 2% 0%",
          backgroundImage:`url(/${props.number}.png)`,
          backgroundPosition:"center",
          backgroundSize: '100% 100%',
          backgroundRepeat:"no-repeat"
          // padding: "5px",
          // overflow: "hidden",
          // clipPath: "polygon(0% 2%, 82% 0%, 90% 98%, 10% 100%)",
        }}
      >
        {/* <img
          src={`${props.number}.png`}
          alt="image"
          height={"100%"}
          width={"100%"}
          style={{
            borderRadius: "18% 18% 18% 10% / 0% 2% 2% 0%",
            // boxShadow: "inset -10px 0 20px -5px rgba(0, 0, 0, 0.2)",
            objectFit: "cover",
          }}
        /> */}
      </Box>
    </div>
  );
});

export default LeftPage;
