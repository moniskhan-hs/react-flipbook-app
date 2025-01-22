import { Box, Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useDispatch, useSelector } from "react-redux";
import LeftPage from "../components/LeftPage";
import NavigationsButtons from "../components/NavigationsButtons";
import RigthPage from "../components/RigthPage";
import StackedLeft from "../components/StackedLeft";
import StackedRigth from "../components/StackedRigth";
import { setSelectedSize } from "../redux/reducers/book";
import { Link } from "react-router-dom";

const FlipbookView: React.FC = () => {
  // const flipBookRef = useRef<HTMLFlipBookRef | null>(null);
  const flipBookRef = useRef();
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
    /* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */
    if (flipBookRef.current && flipBookRef.current.pageFlip()) {
      {
        /* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */
        setTotalPages(flipBookRef.current.pageFlip().getPageCount());
      }
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
    conditionRef.current = event.data;
    setCurrentPage(event.object.pages.currentPageIndex);
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobileView ? "none" : "column",
        alignItems: isMobileView ? "none" : "center",
        justifyContent: isMobileView ? "none" : "center",
        padding: isMobileView ? "2rem" : "1rem", // Padding around the container

        width: "100vw", // full width of the screen
        height: "100vh", // full heigth of the screen
        overflow: "hidden",
        backgroundImage: isMobileView
          ? "none"
          : background
          ? `url(${background})`
          : `url(/bgTable.avif)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* ------------------------------ Pdf Upload Button-------------------------------- */}

      {!isMobileView && (
        <Link
          to={"/upload"}
          style={{
            position: "static",
          }}
        >
          <Button variant="contained">Go to Upload</Button>
        </Link>
      )}

      {/* ------------------------------------------ Wrapper of cover+Book--------------------------------- */}

      <Box
        sx={{
          ...(isMobileView
            ? width > height
              ? {
                  // ---------------- when desktip view pdf uploaded and being view by mobile
                  position: "relative",
                  // bgcolor: "red",
                  transform: " rotate(-90deg) scale(3) ",
                }
              : {
                  // ------------------ Normal Pdf uploaded and being view by mobile
                  // height: "100%",
                  width: "100%",
                  // bgcolor: "rgba(255,255,255,1)",
                  // display: "flex",
                  // justifyContent: "start",
                  // alignItems: "center",
                  // mt:"150",
                  backgroundCcolor: "red",
                  display: "flex",

                  alignSelf: "baseline",
                  marginTop: "10rem",
                  transform: "scale(2.5)",
                }
            : {
                // --------------------- PC or Desktop view
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
              : `linear-gradient(
                90deg,
                #878787 0%,
                #878787 calc(50% - 30px),
                #505050 calc(50% - 30px),
                #505050 calc(50% + 30px),
                #878787 calc(50% + 30px)
              )`,

            position: "relative",
            overflow: "hidden",
          }}
        >
          {!isMobileView && (
            <Box
              sx={{
                visibility: currentPage > 5 ? "visible" : "hidden",
                cursor: currentPage > 1 ? "none" : "pointer",
              }}
            >
              <StackedLeft />
            </Box>
          )}

          {/* Flipbook Component */}
          {/* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */}
          <HTMLFlipBook
            key={`${width}-${height}`}
            width={width}
            height={height}
            usePortrait={isMobileView ? true : false}
            autoSize={false}
            // mobileScrollSupport={isMobileView ? true : false}

            // showCover={true}

            onFlip={onPageChange}
            ref={flipBookRef}
            onChangeState={onChnageStateOfpage}
            startPage={isMobileView ? 0 : 1}
            flippingTime={isMobileView ? 4500 : 1000}
            // swipeDistance={isMobileView?60:30}
            startZIndex={isMobileView ? 10 : 0}
          >
            {/* <FirstCoverPage isMobileView={isMobileView}>Welcome</FirstCoverPage> */}
            {/* ---------------------- Dynamic page viewer---------------------- */}
            {getImagesFromLocalStorage().map((img: string, index: number) => {
              return index % 2 === 0 ? (
                <LeftPage
                  number={index + 1}
                  key={index}
                  url={img}
                  isMobileView={isMobileView}
                >
                  Left Page {index + 1}
                </LeftPage>
              ) : (
                <RigthPage
                  number={index + 1}
                  key={index}
                  url={img}
                  isMobileView={isMobileView}
                >
                  Right Page {index + 1}
                </RigthPage>
              );
            })}

            {/* -------------------------------Static Page Viewer------------------------ */}
            {/* 
            {new Array(10).fill("1").map((_, index) => {
              return index % 2 === 0 ? (
                <LeftPage
                  number={index + 1}
                  key={index}
                  isMobileView={isMobileView}
                >
                  Left Page {index + 1}
                </LeftPage>
              ) : (
                <RigthPage
                  number={index + 1}
                  key={index}
                  isMobileView={isMobileView}
                >
                  Right Page {index + 1}
                </RigthPage>
              );
            })} */}

            {/* <PageCover isMobileView={isMobileView}>The End</PageCover> */}
          </HTMLFlipBook>

          {!isMobileView && (
            <Box
              sx={{
                visibility: currentPage < 8 ? "visible" : "hidden",
              }}
            >
              <StackedRigth />
            </Box>
          )}
        </Stack>
      </Box>

      {isMobileView && (
        <Box
          sx={{
            position: "fixed", // Fix to the viewport
            bottom: 0, // Stick to the bottom
            left: 0, // Align with the left edge
            width: "100%", // Stretch across the screen
            bgcolor: "#fff", // Background color
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)", // Top shadow for emphasis
            p: 2, // Padding
            display: "flex", // Flexbox for layout
            justifyContent: "center", // Space between children
            alignItems: "center", // Vertically center content
            zIndex: 1000, // Ensure it appears above other content
          }}
        >
          {
            <NavigationsButtons
              currentPage={currentPage}
              flipBookRef={flipBookRef}
            />
          }
        </Box>
      )}
      {!isMobileView && (
        <NavigationsButtons
          currentPage={currentPage}
          flipBookRef={flipBookRef}
        />
      )}
    </Box>
  );
};

export default FlipbookView;
