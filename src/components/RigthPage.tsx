import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const RigthPage = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; number: number ; url?:string,isMobileView:boolean }
>((props, ref) => {

  const {width,height} = useSelector((state:{book:BookStateInitState})=>state.book)



  return (
    <div style={{ display: "flex", flexDirection: "row" }} ref={ref}>
      {/* Right Content Box */}
      <Box
        sx={{
          // aspectRatio:width/height,

          height: height,
          width: width,
          bgcolor: "rgba(255,255,255,1)",
          boxShadow: "inset 10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Left shadow
          borderRadius: props.isMobileView?"none":  "18% 18% 18% 18% / 2% 0% 0% 2%",
          zIndex: 10,
          // padding:"5px"
          backgroundImage:`url(${props.number}.png)`,
          backgroundPosition:"center",
          backgroundSize: '100% 100%',
          backgroundRepeat:"no-repeat"
        }}
      >
        {/* <img
          src={props.url}
          alt="image"
          height={"100%"}
          width={"100%"}
          style={{
            borderRadius: "18% 18% 18% 18% / 2% 0% 0% 2%",
            boxShadow: "inset 10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Left shadow
            objectFit: "cover",
          }}
        /> */}
      </Box>

      {/* Right Fluted Panel */}
    </div>
  );
});

export default RigthPage;
