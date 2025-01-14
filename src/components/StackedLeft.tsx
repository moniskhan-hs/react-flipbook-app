import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const StackedLeft = () => {
  const { selectedSize } = useSelector(
    (state: { book: BookStateInitState }) => state.book
  );

  return (
    <Box
      sx={{
        height: selectedSize?.dimensions.height,
        backgroundColor: "gray.100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: `calc(100% - ${selectedSize!.dimensions.height / 50}px)`,
          width: "30px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(248,248,248,1) 50%, rgba(255,255,255,1) 100%)",
          borderRadius: "10px", // Rounded corners
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          position: "relative",
          transform: "perspective(200px) rotateY(-30deg)", // Perspective depth
          transformOrigin: "center",
        }}
      >
        {/* Fluted Stripes */}
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "4px",
              background:
                "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent)",
              left: `${i * 5 + 8}px`,
              boxShadow: "inset -1px 0 2px rgba(0,0,0,0.05)",
            }}
          />
        ))}

        {/* Subtle top-down gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.02) 100%)",
            borderRadius: "inherit",
          }}
        />
      </Box>
    </Box>
  );
};

export default StackedLeft;
