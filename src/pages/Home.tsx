import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FirstCoverPage from "../components/FirstCoverPage";
import LeftPage from "../components/LeftPage";
import PageCover from "../components/PageCover";
import RigthPage from "../components/RigthPage";
import StackedLeft from "../components/StackedLeft";
import StackedRigth from "../components/StackedRigth";
import { resizeBasedOnAspectRatio } from "../utils/data";

// PageCover Component

const DemoBook: React.FC = () => {
  type HTMLFlipBookRef = {
    pageFlip: () => { getPageCount: () => number };
  };
  const flipBookRef = useRef<HTMLFlipBookRef | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  console.log("totalPages:", totalPages);
  const [isStackedVisible, setIsStackedVisible] = useState(false);
  const conditionRef = useRef<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // -------------------------------------- PDF Logic-----------------------------
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [condition,setCondition]=  useState<string>()


  const { width, height } = useSelector(
    (state: { book: BookStateInitState }) => state.book
  );

 

  const tenPercentOfWidth = window.innerWidth*10/100

  const { newWidth, newHeight } = resizeBasedOnAspectRatio(
    width,
    height,
    tenPercentOfWidth
  );

  console.log('width, height :', width, height )
  const myAspectRatio = width/height
  console.log('myAspectRatio:', myAspectRatio)

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    console.log("Window resized:", window.innerWidth, window.innerHeight);
  };

  useEffect(() => {

    if(width>height){
      setCondition('width')
      console.log('width is greater then heigth')
 
      
    }else{
      setCondition('height')
      console.log('heigth is greater than width')
    }
    // (windowSize.width *10)/100
    console.log('window ka 10%', (windowSize.width *10)/100)


    // Add event listener on component mount
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [height,width]); 


 












 
  // Update total pages when `flipBookRef` or `selectedSize` changes
  useEffect(() => {
    if (flipBookRef.current && flipBookRef.current.pageFlip()) {
      setTotalPages(flipBookRef.current.pageFlip().getPageCount());
    }
  }, [flipBookRef, height, width]);

  // Reset currentPage when selectedSize changes
  useEffect(() => {
    setCurrentPage(0); // Reset page to 0 when size changes
  }, [height, width]);

  const onPageChange = React.useCallback((event: { data: number }) => {
    setCurrentPage((prev) => (prev !== event.data ? event.data : prev));
  }, []);

  const onChnageStateOfpage = (event: { data: string }) => {
    console.log("event:", event);
    conditionRef.current = event.data;
  };

  // UseLayoutEffect to manage StackedRigth visibility
  useLayoutEffect(() => {
    if (currentPage > 0 && currentPage < 30) {
      setIsStackedVisible(true);
    } else {
      setIsStackedVisible(false);
    }
  }, [currentPage]);
  // -------------------------------------- PDF Logic----------------------------------------------

  const getImagesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("pdf_images") || "[]");
  };


  return (
    <Box
    sx={{
      // display: "flex",
      // flexDirection: "column",
      // alignItems: "center",
      // justifyContent: "center",
      // padding: "2rem", // Padding around the container
      // height: "100vh",
      // backgroundColor: "#f5f5f5",


      width:'100vw', // full width of the screen
      height:"90vh", // full heigth of the screen
      overflow: "hidden",
    }}
  
    >
      {/* <Controls /> */}

      <Link
        to={"/upload"}
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
          }}
        >
          Upload
        </Button>

        <Typography>
          {" "}
          Height : {height} width : {width}{" "}
        </Typography>
      </Link>

      {/* ------------------------------------------ Wrapper of cover+Book--------------------------------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%", // full width of the screen
          // aspectRatio:'1/1',
          height: "100%",  // full heigth ot the 90vh of screen

          // padding: "0 10%", // padding inline - of 10% of the width of screen
          border: "1px solid",
          // bgcolor: "#000",
        }}

        // sx={{
        //   width: "100%",
        //   maxWidth: "90vw", // 90% of the viewport width
        //   maxHeight: "90vh", // 90% of the viewport height
        //   aspectRatio: "3 / 4", // Maintains a 3:4 aspect ratio
        //   margin: "0 auto",
        //   position: "relative",
        //   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        // }}
      >

        {/* --------------------------------- Cover---------------------------- */}


        <Stack
          flexDirection={"row"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={currentPage > 5 ? width * 2 + 60 : width * 2 + 50}
          height={height + 20}
          sx={{
            transition: "background-color 0.3s ease",
            background:
              currentPage > 0 && currentPage < 4
                ? `linear-gradient(
      90deg,
      #878787 0%,
      #878787 calc(50% - 30px),
      #505050 calc(50% - 30px),
      #505050 calc(50% + 30px),
      #878787 calc(50% + 30px)
    )`
                : "transparent",
            position: "relative", 
            overflow: "hidden",   
          }}
        >
          <Box
            sx={{
              visibility:
                currentPage > 5 && currentPage < 4 ? "visible" : "hidden",
            }}
          >
            <StackedLeft />
          </Box>

          {/* Flipbook Component */}

          <HTMLFlipBook
            key={`${width}-${height}`}
            width={width}
            height={height }
            // size="stretch"
            showCover={true} // Ensures cover pages are part of the flipbook
            mobileScrollSupport={true}
            onFlip={onPageChange}
            ref={flipBookRef}
            onChangeState={onChnageStateOfpage}
            style={{
              zIndex: 100, // Ensure it is above the background cover
              // aspectRatio : myAspectRatio
            }}

            // key={`${width}-${height}`}
            // width={Math.min(width, 800)} // Caps max width at 800px
            // height={Math.min(height, 1000)} // Caps max height at 1000px
            // showCover
            // mobileScrollSupport
            // ref={flipBookRef}
            // onFlip={(e) => setCurrentPage(e.data)}
            // style={{
            //   width: "100%",
            //   height: "100%",
            // }}

          >
            <FirstCoverPage>Welcome to my Book</FirstCoverPage>

            {/* -------------------------------- Pages of the book--------------------------------------- */}
            {/* {new Array(30).fill(0).map((_, index) => {
              return index % 2 === 0 ? (
                <LeftPage number={index + 1} key={index}>
                  Left Page {index + 1}
                </LeftPage>
              ) : (
                <RigthPage number={index + 1} key={index}>
                  Right Page {index + 1}
                </RigthPage>
              );
            }
          
          
          )
            
            
            } */}

            {getImagesFromLocalStorage().map((img: string, index: number) => {
              return index % 2 === 0 ? (
                <LeftPage number={index + 1} key={index} url={img}>
                  Left Page {index + 1}
                </LeftPage>
              ) : (
                <RigthPage number={index + 1} key={index} url={img}>
                  Right Page {index + 1}
                </RigthPage>
              );
            })}
            {/* { getImagesFromLocalStorage().length %2==1 && (<BlankPage/>)} */}

            <PageCover>The End</PageCover>
          </HTMLFlipBook>

          <Box
            sx={{
              visibility:
                currentPage > 0 && currentPage < 4 ? "visible" : "hidden",
            }}
          >
            <StackedRigth />
          </Box>
        </Stack>

      </Box>



      
    </Box>
  );
};

export default DemoBook;
