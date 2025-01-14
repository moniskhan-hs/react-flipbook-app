// // import { Box, Stack } from "@mui/material";

// // const Home = () => {
// //   const pages = 100;

// //   const firstquarter = pages / 4;

// //   const midportion = pages / 2;

// //   const lastquarter = (3 * pages) / 4;

// //   return (
// //     <Stack direction={"row"} justifyContent={"center"} mt={5}>
// //       {/* --------------------- Cover background */}
// //       <Stack
// //         direction={"row"}
// //         justifyContent={"center"}
// //         mt={5}
// //         p={3}
// //         borderRadius={2}
// //         bgcolor={'#d3d3d3'}
// //       >
// //         {/* //* ------------------------------------------------------------Left page Page---------------------------------------------------- */}
// //         <Stack direction={"row"}>
// //           <Box
// //             sx={{
// //               height: "600px",
// //               backgroundColor: "gray.100",
// //               display: "flex",
// //               justifyContent: "center",
// //               alignItems: "center",
// //             }}
// //           >
// //             <Box
// //               sx={{
// //                 height: "calc(100% - 40px)",
// //                 width: "50px", // Adjusted width
// //                 background:
// //                   "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(248,248,248,1) 50%, rgba(255,255,255,1) 100%)",
// //                 borderRadius: "2px",
// //                 boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
// //                 position: "relative",
// //                 transform: "perspective(200px) rotateY(-30deg)", // Opposite tilt
// //                 transformOrigin: "center",
// //               }}
// //             >
// //               {/* Fluted stripes */}
// //               {[...Array(5)].map((_, i) => (
// //                 <Box
// //                   key={i}
// //                   sx={{
// //                     position: "absolute",
// //                     top: 0,
// //                     bottom: 0,
// //                     width: "6px",
// //                     background:
// //                       "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent)",
// //                     left: `${i * 8 + 8}px`,
// //                     boxShadow: "inset -1px 0 2px rgba(0,0,0,0.05)",
// //                   }}
// //                 />
// //               ))}

// //               {/* Subtle top-down gradient */}
// //               <Box
// //                 sx={{
// //                   position: "absolute",
// //                   top: 0,
// //                   left: 0,
// //                   right: 0,
// //                   bottom: 0,
// //                   background:
// //                     "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.02) 100%)",
// //                   borderRadius: "inherit",
// //                   boxShadow: "inset 10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Left shadow
// //                 }}
// //               />
// //             </Box>
// //           </Box>
// //           <Box
// //             sx={{
// //               height: "600px",
// //               width: "500px",
// //               bgcolor: "rgba(255,255,255,1)",
// //               // border: "1px solid rgba(208, 188, 188, 0.95)",
// //               boxShadow: "inset -10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Right shadow // Subtle shadow
// //             }}
// //           ></Box>
// //         </Stack>

// //         {/* //! ------------------------------------------------------------Rigth Page---------------------------------------------------- */}

// //         <Stack direction={"row"}>
// //           {/* Right Content Box */}
// //           <Box
// //             sx={{
// //               height: "600px",
// //               width: "500px",
// //               bgcolor: "rgba(255,255,255,1)",
// //               boxShadow: "inset 10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Left shadow (opposite of original)
// //             }}
// //           ></Box>

// //           {/* Left Fluted Panel */}
// //           <Box
// //             sx={{
// //               height: "600px",
// //               backgroundColor: "gray.100",
// //               display: "flex",
// //               justifyContent: "center",
// //               alignItems: "center",
// //             }}
// //           >
// //             <Box
// //               sx={{
// //                 height: "calc(100% - 40px)",
// //                 width: "50px",
// //                 background:
// //                   "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(248,248,248,1) 50%, rgba(255,255,255,1) 100%)",
// //                 borderRadius: "2px",
// //                 boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
// //                 position: "relative",
// //                 transform: "perspective(200px) rotateY(30deg)", // Adjusted tilt (opposite direction)
// //                 transformOrigin: "center",
// //               }}
// //             >
// //               {/* Fluted Stripes */}
// //               {[...Array(5)].map((_, i) => (
// //                 <Box
// //                   key={i}
// //                   sx={{
// //                     position: "absolute",
// //                     top: 0,
// //                     bottom: 0,
// //                     width: "6px",
// //                     background:
// //                       "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent)",
// //                     left: `${i * 8 + 8}px`,
// //                     boxShadow: "inset -1px 0 2px rgba(0,0,0,0.05)",
// //                   }}
// //                 />
// //               ))}

// //               {/* Subtle Top-Down Gradient */}
// //               <Box
// //                 sx={{
// //                   position: "absolute",
// //                   top: 0,
// //                   left: 0,
// //                   right: 0,
// //                   bottom: 0,
// //                   background:
// //                     "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.02) 100%)",
// //                   borderRadius: "inherit",
// //                   boxShadow: "inset -10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Right shadow (opposite of original)
// //                 }}
// //               />
// //             </Box>
// //           </Box>
// //         </Stack>
// //       </Stack>
// //     </Stack>

// //   );
// // };

// // export default Home;

import { Box, Stack } from "@mui/material";
import React from "react";

const Home = () => {
 return (
    <Stack direction={"row"} justifyContent={"center"} mt={5}>
      {/* --------------------- Cover background ----------------------*/}

      <Stack
        style={{
          marginTop: "2rem",
          padding: "1rem",
          borderRadius: "2rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "gray",
        }}
      >
        {/* //* ------------------------------------------------------------Left Page---------------------------------------------------- */}
        <Stack direction={"row"}>
          <Box
            sx={{
              height: "600px",
              backgroundColor: "gray.100",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "calc(100% - 40px)",
                width: "50px",
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
              {[...Array(10)].map((_, i) => (
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
          <Box
            sx={{
              height: "600px",
              width: "500px",
              bgcolor: "rgba(255,255,255,1)",
              boxShadow: "inset -10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Subtle shadow
            }}
          >
            page 
          </Box>
        </Stack>

        {/* //! ------------------------------------------------------------Right Page---------------------------------------------------- */}

        <Stack direction={"row"}>
          {/* Right Content Box */}
          <Box
            sx={{
              height: "600px",
              width: "500px",
              bgcolor: "rgba(255,255,255,1)",
              boxShadow: "inset 10px 0 20px -5px rgba(0, 0, 0, 0.2)", // Left shadow
            }}
          > page</Box>

          {/* Right Fluted Panel */}
          <Box
            sx={{
              height: "600px",
              backgroundColor: "gray.100",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "calc(100% - 25px)",
                width: "50px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(248,248,248,1) 50%, rgba(255,255,255,1) 100%)",
                borderRadius: "10px", // Rounded corners
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                position: "relative",
                transform: "perspective(200px) rotateY(30deg)", // Opposite tilt
                transformOrigin: "center",
              }}
            >
              {/* Fluted Stripes */}
              {[...Array(10)].map((_, i) => (
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

              {/* Subtle Top-Down Gradient */}
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
        </Stack>

      </Stack>
    </Stack>
  );

};

export default Home;
