import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook, { HTMLFlipBookRef, FlipEvent } from "react-pageflip";
import LeftPage from "../components/LeftPage";
import RigthPage from "../components/RigthPage";
import StackedLeft from "../components/StackedLeft";
import StackedRigth from "../components/StackedRigth";
import { Box, Stack, Typography } from "@mui/material";
import { retry } from "@reduxjs/toolkit/query";
import Controls from "../components/Controls";
import { useSelector } from "react-redux";

// PageCover Component
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
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          marginBottom: 20,
        }}
      >
        <Box>
          <h2>{props.children}</h2>

          <Typography>Welcome</Typography>
        </Box>
      </Stack>
    </div>
  );
});

const FirstCoverPage = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      {/* ----------------------------- main cover page------------------------- */}
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
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          // backgroundImage:`url(/1.png)`,
          // backgroundPosition:"center",
          // backgroundSize: '100% 100%',
          // backgroundRepeat:"no-repeat",
          // padding:"2rem"
        }}
      >
        <Box>
          <h2>{props.children}</h2>

          {/* <Typography>to my Book</Typography> */}
        </Box>
      </Stack>
    </div>
  );
});

// Page Component
const Page = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; number: number }
>((props, ref) => {
  return (
    <div
      className="page"
      ref={ref}
      style={{
        backgroundColor: "gray",
      }}
    >
      <div className="page-content">
        <h2 className="page-header">Page header - {props.number}</h2>
        <div className="page-image"></div>
        <div className="page-text">{props.children}</div>
        <div className="page-footer">Page {props.number + 1}</div>
      </div>
    </div>
  );
});



const DemoBook: React.FC = () => {
  const flipBookRef = useRef<HTMLFlipBookRef | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Redux state for selected size
  const { selectedSize } = useSelector(
    (state: { book: BookStateInitState }) => state.book
  );

  // Update total pages when `flipBookRef` or `selectedSize` changes
  useEffect(() => {
    if (flipBookRef.current && flipBookRef.current.pageFlip()) {
      setTotalPages(flipBookRef.current.pageFlip().getPageCount());
    }
  }, [flipBookRef, selectedSize]);

  // Reset currentPage when selectedSize changes
  useEffect(() => {
    setCurrentPage(0); // Reset page to 0 when size changes
  }, [selectedSize]);

  // Handle page flip event
  // const onPageChange = (event: FlipEvent) => {
  //   setCurrentPage(event.data);
  //   console.log("Current Page:", event.data);
  // };

  const onPageChange = React.useCallback(
    (event: FlipEvent) => {
      setCurrentPage((prev) => (prev !== event.data ? event.data : prev));
     console.log(event.data)
    },
    []
  );



  return (
    <div>
      <Controls />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "90vh",
          padding: "0 5rem",
        }}
      >
        <Stack
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          width={
            currentPage > 5
              ? selectedSize!.dimensions.width * 2 + 100
              : selectedSize!.dimensions.width * 2 + 90
          }
          height={selectedSize!.dimensions.height + 30}
          bgcolor={currentPage > 0 && currentPage < 30 ? "gray" : "none"}
          borderRadius={5}

          sx={{
            transition: "background-color 0.3s ease", // Smooth transition to avoid flicker
          }}



        >
          {/* {currentPage > 5 && <StackedLeft />} */}
          <Box sx={{ visibility: currentPage > 5  && currentPage <30? "visible" : "hidden" }}>
    <StackedLeft />
  </Box>

          <HTMLFlipBook
            key={`${selectedSize!.dimensions.width}-${selectedSize!.dimensions.height}`}
            width={selectedSize!.dimensions.width}
            height={selectedSize!.dimensions.height}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPageChange}
            ref={flipBookRef}
          >
            <FirstCoverPage>Welcome to my Book</FirstCoverPage>
            {new Array(30).fill(0).map((_, index) => {
              return index % 2 === 0 ? (
                <LeftPage number={index + 1} key={index}>
                  Left Page {index + 1}
                </LeftPage>
              ) : (
                <RigthPage number={index + 1} key={index}>
                  Right Page {index + 1}
                </RigthPage>
              );
            })}
            <PageCover>The End</PageCover>
          </HTMLFlipBook>
          {/* {currentPage > 0 && currentPage < 30 && <StackedRigth />} */}

          <Box sx={{ visibility: currentPage >0 && currentPage < 30 ? "visible" : "hidden" }}>
    <StackedRigth />
  </Box>
        </Stack>
      </Box>
    </div>
  );
};

export default DemoBook;
