import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FirstCoverPage from "../components/FirstCoverPage";
import LeftPage from "../components/LeftPage";
import PageCover from "../components/PageCover";
import RigthPage from "../components/RigthPage";
import StackedLeft from "../components/StackedLeft";
import StackedRigth from "../components/StackedRigth";
import { EventNoteTwoTone } from "@mui/icons-material";
import pageFlip from "react-pageflip";
import PageFlip from "react-pageflip";
import zIndex from "@mui/material/styles/zIndex";
import { setSelectedSize } from "../redux/reducers/book";

// PageCover Component

const FlipbookView: React.FC = () => {
  type HTMLFlipBookRef = {
    pageFlip: () => {
      getPageCount: () => number;
      turnToPage: (pageIndex: number) => void;
    };
  };
  const flipBookRef = useRef<unknown | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { width, height } = useSelector(
    (state: { book: BookStateInitState }) => state.book
  );
  const dispatch = useDispatch();
  const { background } = useSelector(
    (state: { backgroundReducer: BackgroundInitStateTyoe }) =>
      state.backgroundReducer
  );
  console.log("totalPages:", totalPages);
  //--------------------------------------------

  //-------------------------------------------
  const [isStackedVisible, setIsStackedVisible] = useState(false);
  console.log("isStackedVisible:", isStackedVisible);
  const conditionRef = useRef<string | null>(null);

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("sm")); // Adjust breakpoint as needed
  console.log("isMobileView:", isMobileView);

  // -------------------------------------- PDF Logic-----------------------------

  // Update total pages when `flipBookRef` or `selectedSize` changes
  useEffect(() => {
    if (flipBookRef.current && flipBookRef.current.pageFlip()) {
      setTotalPages(flipBookRef.current.pageFlip().getPageCount());
    }
    console.log("home page rendered");
  }, [flipBookRef, height, width]);

  // Reset currentPage when selectedSize changes
  useEffect(() => {
    setCurrentPage(0); // Reset page to 0 when size changes
    console.log("home page rendered");
  }, [height, width]);

  const onPageChange = React.useCallback((event: { data: number }) => {
    console.log("event:", event);
    console.log("this line rendered");

    setCurrentPage((prev) => (prev !== event.data ? event.data : prev));
  }, []);

  const onChnageStateOfpage = (event: {
    data: string;
    object: { pages: { currentPageIndex: number } };
  }) => {
    // console.log("PageNumber:", event.data.pages.currentPageIndex);
    console.log("event:", event);
    conditionRef.current = event.data;

    const currentPage = event.object.pages.currentPageIndex;
    console.log("flipbookref:", flipBookRef.current);

    // if (currentPage === 1) {
    //   console.log("Preventing flip to page:", currentPage);
    //   flipBookRef.current?.pageFlip().turnToPage(1); // Go back to the first page
    //   console.log(
    //     "flipBookRef.current?.pageFlip().turnToPage(1):",
    //     flipBookRef.current?.pageFlip().turnToPage(1)
    //   );
    // } else {
    //   console.log("Allowed flip to page:", currentPage);
    // }
  };

  // UseLayoutEffect to manage StackedRigth visibility
  useLayoutEffect(() => {
    if (currentPage > 0 && currentPage < 30) {
      setIsStackedVisible(true);
    } else {
      setIsStackedVisible(false);
    }
    console.log("home page rendered");
  }, [currentPage]);
  // -------------------------------------- PDF Logic----------------------------------------------

  const getImagesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("pdf_images") || "[]");
  };

  const prevButtonClick = () => {
    flipBookRef.current?.getPageFlip().flipNext();
  };

  //------------------------------- Mobile view logic---------------------------
  useEffect(() => {
    if (!isMobileView) return;
    const handleresize = () => {
      const aspectRationofScreen = window.innerWidth / window.innerHeight;
      console.log("aspectRationofScreen:", aspectRationofScreen);

      const aspectRationOfBook = Number(width) / Number(height);
      // 600 / 400
      console.log("aspectRationOfBook:", aspectRationOfBook);

      const availableHeigth = window.innerHeight - height;
      console.log("availableHeigth:", availableHeigth);
      const availableWidth = window.innerWidth / 2 - width;
      console.log("availableWidth:", availableWidth);

      // check if width negative and  height positive is available or not
      if (availableWidth < 0 && availableHeigth > 0) {
        // negative value
        console.log("heigth + width -");
        const negativeValueTopositive = Math.abs(availableWidth);
        console.log("negativeValueTopositive:", negativeValueTopositive);
        const newWidthOfFlipbook =
          window.innerWidth / 2 - window.innerWidth * 0.1;
        console.log("newWidthOfFlipbook:", newWidthOfFlipbook);

        const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;
        console.log("newHeigthOFflipbook:", newHeigthOFflipbook);

        dispatch(
          setSelectedSize({
            width: newWidthOfFlipbook,
            height: newHeigthOFflipbook,
          })
        );
        // both positive
      } else if (availableHeigth > 0 && availableWidth > 0) {
        console.log("heigth + width +");
        const newWidthOfFlipbook = availableWidth / 2 + width;
        console.log("newWidthOfFlipbook:", newWidthOfFlipbook);

        const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;
        console.log("newHeigthOFflipbook:", newHeigthOFflipbook);

        if (newHeigthOFflipbook > window.innerHeight) {
          const newHeight = window.innerHeight * 0.8;
          console.log("newHeight:", newHeight);
          const newWidth = newHeight * aspectRationOfBook;
          console.log("newWidth:", newWidth);

          dispatch(
            setSelectedSize({
              width: newWidth,
              height: newHeight,
            })
          );
        } else {
          dispatch(
            setSelectedSize({
              width: newWidthOfFlipbook,
              height: newHeigthOFflipbook,
            })
          );
        }
        //  width and heigth negative
      } else if (availableHeigth < 0 && availableWidth > 0) {
        console.log("heigth - width +");
        const newHeigthOFflipbook = window.innerHeight * 0.8;
        console.log("newHeigthOFflipbook:", newHeigthOFflipbook);

        const newWidthOfFlipbook = newHeigthOFflipbook * aspectRationOfBook;
        console.log("newWidthOfFlipbook:", newWidthOfFlipbook);

        dispatch(
          setSelectedSize({
            width: newWidthOfFlipbook,
            height: newHeigthOFflipbook,
          })
        );
      }
    };

    if (isMobileView) handleresize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileView]);

  if (getImagesFromLocalStorage().length == 0) {
    return <Box>Sorry... No Book Available</Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobileView ? "2rem" : "1rem", // Padding around the container
        // height: "100vh",
        // backgroundColor: "#f5f5f5",

        width: "100vw", // full width of the screen
        height: "100vh", // full heigth of the screen
        overflow: "hidden",
        backgroundImage: background
          ? `url(${background})`
          : `url(/bgTable.avif)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* ------------------------------------------ Wrapper of cover+Book--------------------------------- */}
      <Box
        sx={{
          ...(isMobileView
            ? width > height
              ? {
                  position: "relative",
                  // bgcolor: "red",
                  transform: " rotate(-90deg) scale(3) ",
                }
              : {
                  height: "90vh",
                  width: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: "scale(1.9)",
                }
            : {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }),
        }}
      >
        {/* --------------------------------- Cover---------------------------- */}

        <Stack
          flexDirection={"row"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={
            isMobileView && width > height
              ? "100vh"
              : currentPage > 5
              ? width * 2 + 60
              : width * 2 + 50
          }
          height={isMobileView && width > height ? "100vw" : height + 20}
          sx={{
            transition: "background-color 0.3s ease",
            background: isMobileView
            ? "none"
            : currentPage > 0  || currentPage ==3
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
        {!isMobileView &&  <Box
            sx={{
              visibility:
                currentPage > 5 && currentPage < 4 ? "visible" : "hidden",
            }}
          >
            <StackedLeft />
          </Box>}

          {/* Flipbook Component */}
          {/* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */}
          <HTMLFlipBook
            key={`${width}-${height}`}
            width={width}
            height={height}
            usePortrait={isMobileView ? true : false}
            autoSize={false}
            mobileScrollSupport={isMobileView ? true : false}
            showCover={true} 
            onFlip={onPageChange}
            ref={flipBookRef}
            onChangeState={onChnageStateOfpage}
            startPage={1}
          >
           <FirstCoverPage>Welcome to my Book</FirstCoverPage>

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

         {!isMobileView && <Box
            sx={{
              visibility:
                currentPage > 0 && currentPage < 4 ? "visible" : "hidden",
            }}
          >
            <StackedRigth />
          </Box>}

        </Stack>
      </Box>
    </Box>
  );
};

export default FlipbookView;
