import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageLoader from "./PageLoader";

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = props.url!;
    img.onload = () => setLoaded(true);
  }, [props.url]);

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
          // backgroundImage: `url(${props.number}.png)`, //static view
          backgroundImage: loaded ? `url(${props.url})` : "none",
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
        {!loaded && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PageLoader />
          </Box>
        )}
      </Box>
    </div>
  );
});

export default LeftPage;
