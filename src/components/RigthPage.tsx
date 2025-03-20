import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageLoader from "./PageLoader";

const RigthPage = React.forwardRef<
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
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!props.url) {
      setImageUrl(null);
      return;
    }

    setLoaded(false);
    setError(false);
    
    const img = new Image();
    img.src = props.url;
    
    img.onload = () => {
      setImageUrl(props.url!);
      setLoaded(true);
      setError(false);
    };
    
    img.onerror = () => {
      setImageUrl(null);
      setError(true);
      setLoaded(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [props.url]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }} ref={ref}>
      <Box
        sx={{
          height: height,
          width: width,
          bgcolor: "rgba(255,255,255,1)",
          boxShadow: "inset 10px 0 20px -5px rgba(0, 0, 0, 0.2)",
          borderRadius: props.isMobileView
            ? "none"
            : "18% 18% 18% 18% / 2% 0% 0% 2%",
          zIndex: 10,
          backgroundImage: loaded 
            ? `url('${imageUrl}')` 
            : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundPosition: "center",
          backgroundSize: loaded ? "100% 100%" : "400% 400%",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          position: "relative",
          overflow: "hidden",
          transition: "background-image 0.3s ease, background-size 0.3s ease",
          animation: !loaded && !error ? "shimmer 1.5s infinite" : "none",
        }}
      >
        {!loaded && !error && (
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
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            <PageLoader />
          </Box>
        )}

        {error && (
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
              backgroundColor: "rgba(255,255,255,0.9)",
              color: "error.main",
              fontSize: "0.8rem",
            }}
          >
            Failed to load image
          </Box>
        )}
      </Box>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
      `}</style>
    </div>
  );
});

export default RigthPage;