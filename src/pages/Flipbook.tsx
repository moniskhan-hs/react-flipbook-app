import { VolumeOff, VolumeUp } from "@mui/icons-material";
import { Box, IconButton, Stack, useMediaQuery, useTheme } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeftPage from "../components/LeftPage";
import NavigationsButtons from "../components/NavigationsButtons";
import PageLoader from "../components/PageLoader";
import RigthPage from "../components/RigthPage";
import StackedLeft from "../components/StackedLeft";
import StackedRigth from "../components/StackedRigth";
import { db } from "../firebase";
import { setSelectedSize } from "../redux/reducers/book";

type Props = {
  isFetchingData?: boolean;
  images?: ImagesType;
  backgroundTemp?: string | null | undefined;
  coverColor?: string;
  spineColor?: string;
  logoTemp?: string | null | undefined;
  audioFile?: string | undefined;
};

const FlipbookView = ({
  isFetchingData,
  images,
  backgroundTemp,
  coverColor,
  spineColor,
  logoTemp,
  audioFile,
}: Props) => {
  //--------------------------------------------State------------------------------------
  const { bookid } = useParams();
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { width, height } = useSelector(
    (state: { book: BookStateInitState }) => state.book
  );
  const dispatch = useDispatch();
  const [documentData, setDocumentData] =
    useState<BookDataFromFirestoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // to check the file is uploaded has the desktop nature and being view in mobile
  const [isDesktopMobileViewd, setIsDesktopMobileViewd] =
    useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(false);

  //------------------------------------------- Global variable [entire file]----------------------------

  const conditionRef = useRef<string | null>(null);

  const theme = useTheme();

  const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));

  // --------------------------------------------Sound Logic--------------------------------

  const flipSoundRef = useRef<HTMLAudioElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  // -------------------------------------- PDF Logic----------------------------

  // Reset currentPage when selectedSize changes
  useEffect(() => {
    setCurrentPage(0); // Reset page to 0 when size changes
  }, [height, width]);

  const onPageChange = React.useCallback((event: { data: number }) => {
    setCurrentPage((prev) => (prev !== event.data ? event.data : prev));
  }, []);

  const onChnageStateOfpage = (event: {
    data: string;
    object: { pages: { currentPageIndex: number } };
  }) => {
    if (flipSoundRef.current) {
      if (event.data == "flipping") {
        flipSoundRef.current.play();
        console.log("sound played");
      }
    }
    conditionRef.current = event.data;
  };

  // ---------------------------------- Fetching the Data from the cloud firestore and desktop view--------------------

  useEffect(() => {
    const handleresize = (heigthOfBook: number, widthOfBook: number) => {
      // fetch the height and width of book from data base
      const aspectRationOfBook = Number(widthOfBook) / Number(heigthOfBook);
      const availableHeigth = window.innerHeight - heigthOfBook;
      const availableWidth = window.innerWidth / 2 - widthOfBook;

      // check if width negative and  height positive is available or not
      if (availableWidth < 0 && availableHeigth > 0) {
        // negative value
        const newWidthOfFlipbook =
          window.innerWidth / 2 - window.innerWidth * 0.1;

        const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;

        dispatch(
          setSelectedSize({
            width: newWidthOfFlipbook,
            height: newHeigthOFflipbook,
          })
        );
        // both positive
      } else if (availableHeigth > 0 && availableWidth > 0) {
        console.log("heigth + width +");
        const newWidthOfFlipbook = availableWidth / 2 + widthOfBook;

        const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;

        if (newHeigthOFflipbook > window.innerHeight) {
          const newHeight = window.innerHeight * 0.8;
          const newWidth = newHeight * aspectRationOfBook;

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

        const newWidthOfFlipbook = newHeigthOFflipbook * aspectRationOfBook;

        dispatch(
          setSelectedSize({
            width: newWidthOfFlipbook,
            height: newHeigthOFflipbook,
          })
        );
      }
    };

    if (isFetchingData && bookid) {
      let isMounted = true; // Track component mount status to avoid memory leaks

      const fetchDocumentById = async () => {
        try {
          // Reference the document using its ID
          setLoading(true);
          const docRef = doc(db, "flipbooks", bookid);

          // Fetch the document
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && isMounted) {
            // Document exists
            console.log("Data fetch successfully in first:");
            const heigthOfBook = docSnap.data().heigthOfBook;
            const widthOfBook = docSnap.data().widthOfBook;
            handleresize(heigthOfBook, widthOfBook);

            setDocumentData(docSnap.data() as BookDataFromFirestoreType);
            setLoading(false);
          } else if (isMounted) {
            // No such document
            console.log("No document found with this ID");
            setDocumentData(null);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching document:", error);
            setError("Failed to fetch document.");
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      if (!isMobileView) fetchDocumentById();

      // Cleanup function
      return () => {
        isMounted = false; // Prevent state updates if component unmounts
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingData, bookid, dispatch]);

  // ------------------------------- Mobile view logic---------------------------
  useEffect(() => {
    if (!isMobileView) return;

    const handleresize = (heigthOfBook: number, widthOfBook: number) => {
      // fetch the height and width of book from data base
      const aspectRationOfBook = Number(widthOfBook) / Number(heigthOfBook);
      const availableHeigth = window.innerHeight - heigthOfBook;
      const availableWidth = window.innerWidth / 2 - widthOfBook;
      // check if width negative and  height positive is available or not
      if (availableWidth < 0 && availableHeigth > 0) {
        console.log("heigth + width -");

        // negative value
        const newWidthOfFlipbook = window.innerHeight;

        const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;

        if (newWidthOfFlipbook > newHeigthOFflipbook) {
          console.log("width > heigth");
          const newWidthOfFlipbook =
            window.innerHeight - window.innerHeight * 0.2;
          const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;

          dispatch(
            setSelectedSize({
              width: newWidthOfFlipbook,
              height: newHeigthOFflipbook,
            })
          );
          setIsDesktopMobileViewd(true);
        } else {
          dispatch(
            setSelectedSize({
              width: newWidthOfFlipbook,
              height: newHeigthOFflipbook,
            })
          );
        }

        // both positive
      } else if (availableHeigth > 0 && availableWidth > 0) {
        console.log("heigth + width +");
        const newWidthOfFlipbook = availableWidth / 2 + widthOfBook;

        const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;

        if (newHeigthOFflipbook > window.innerHeight) {
          const newHeight = window.innerHeight * 0.65;
          const newWidth = newHeight * aspectRationOfBook;
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
        const newHeigthOFflipbook = window.innerHeight * 0.65;

        const newWidthOfFlipbook = newHeigthOFflipbook * aspectRationOfBook;
        dispatch(
          setSelectedSize({
            width: newWidthOfFlipbook,
            height: newHeigthOFflipbook,
          })
        );
      } else if (availableWidth < 0 && availableHeigth < 0) {
        console.log("heigth - width -");

        if (width > height) {
          const newWidthOfFlipbook = (window.innerWidth / 2) * 0.9;
          const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;
          dispatch(
            setSelectedSize({
              width: newWidthOfFlipbook,
              height: newHeigthOFflipbook,
            })
          );
        } else {
          const newWidthOfFlipbook = window.innerWidth;
          const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;
          dispatch(
            setSelectedSize({
              width: newWidthOfFlipbook,
              height: newHeigthOFflipbook,
            })
          );
        }
      } else {
        console.log("This is the other case....");
      }
    };

    let isMounted = true;
    const fetchDocumentById = async () => {
      try {
        setLoading(true);
        // Reference the document using its ID
        const docRef = doc(db, "flipbooks", bookid as string);

        // Fetch the document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && isMounted) {
          // Document exists
          console.log("Data fetch successfully in second:");
          const heigthOfBook = docSnap.data().heigthOfBook;
          const widthOfBook = docSnap.data().widthOfBook;
          handleresize(heigthOfBook, widthOfBook);

          setDocumentData(docSnap.data() as BookDataFromFirestoreType); // Update state with document data
          setLoading(false);
        } else if (isMounted) {
          // No such document
          console.log("No document found with this ID");
          setDocumentData(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching document:", error);
          setError("Failed to fetch document.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (isMobileView) fetchDocumentById();

    return () => {
      isMounted = false; // Prevent state updates if component unmounts
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileView]);

  useEffect(() => {
    document.body.style.overflow = isDesktopMobileViewd ? "auto" : "hidden";
  }, [isDesktopMobileViewd]); // Re-run whenever isOverflowHidden changes

  // --------------------ensuring the audio starts playin initially--------------
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1; // Set initial volume
    }
  }, []);

  // --------------- showing the loader----------------------------
  if (loading && isFetchingData && bookid) return <PageLoader></PageLoader>;

  if (error) return <h2>Something went wrong</h2>;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobileView ? "none" : "column",
        alignItems: isMobileView ? "none" : "center",
        justifyContent: isMobileView ? "none" : "center",
        padding: isMobileView ? "0rem" : "1rem", // Padding around the container
        width: "100vw", // full width of the screen
        height: "100vh", // full heigth of the screen
        overflow: "hidden",
        backgroundImage: isMobileView
          ? "none"
          : `url(${
              isFetchingData && bookid
                ? documentData?.background
                : backgroundTemp
            })`,
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
                  // ---------------- when desktip view pdf uploaded and being view by mobile
                  transform: " rotate(-90deg)",
                }
              : {
                  // ------------------ Normal Pdf uploaded and being view by mobile
                  width: "100%",
                  display: "flex",
                }
            : {
                // --------------------- PC or Desktop view
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }),
        }}
      >
        {/* --------------------------------- Cover---------------------------- */}
        <Stack
          flexDirection={"row"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={"8px"}
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
            boxShadow: `rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px`,
            background: isMobileView
              ? "none"
              : `linear-gradient(
              90deg,
              ${
                isFetchingData && bookid ? documentData?.coverColor : coverColor
              } 0%,
               ${
                 isFetchingData && bookid
                   ? documentData?.coverColor
                   : coverColor
               } calc(50% - 30px),
               ${
                 isFetchingData && bookid
                   ? documentData?.spineColor
                   : spineColor
               } calc(50% - 30px),
              ${
                isFetchingData && bookid ? documentData?.spineColor : spineColor
              } calc(50% + 30px),
              ${
                isFetchingData && bookid ? documentData?.coverColor : coverColor
              } calc(50% + 30px)
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

          {/*-------------------------------------- Flipbook-------------------------------------------- */}
          {/* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */}
          <HTMLFlipBook
            key={`${width}-${height}`}
            width={width}
            height={height}
            usePortrait={isMobileView ? true : false}
            autoSize={false}
            onFlip={onPageChange}
            ref={flipBookRef}
            onChangeState={onChnageStateOfpage}
            startPage={isMobileView ? 0 : 1}
            flippingTime={isMobileView ? 1500 : 1100}
            // swipeDistance={isMobileView?60:30}
            startZIndex={isMobileView ? 10 : 0}
          >
            {/* <FirstCoverPage isMobileView={isMobileView}>Welcome</FirstCoverPage> */}
            {/* ---------------------- Dynamic page viewer---------------------- */}
            {isFetchingData && bookid
              ? documentData?.images.map((ele, index) => {
                  return index % 2 === 0 ? (
                    <LeftPage
                      number={index + 1}
                      key={index}
                      url={ele}
                      isMobileView={isMobileView}
                    >
                      Left Page {index + 1}
                    </LeftPage>
                  ) : (
                    <RigthPage
                      number={index + 1}
                      key={index}
                      url={ele}
                      isMobileView={isMobileView}
                    >
                      Right Page {index + 1}
                    </RigthPage>
                  );
                })
              : images?.map((ele, index) => {
                  return index % 2 === 0 ? (
                    <LeftPage
                      number={index + 1}
                      key={index}
                      url={ele.dataUrl}
                      isMobileView={isMobileView}
                    >
                      Left Page {index + 1}
                    </LeftPage>
                  ) : (
                    <RigthPage
                      number={index + 1}
                      key={index}
                      url={ele.dataUrl}
                      isMobileView={isMobileView}
                    >
                      Right Page {index + 1}
                    </RigthPage>
                  );
                })}

            {/* <PageCover isMobileView={isMobileView}>The End</PageCover> */}
          </HTMLFlipBook>

          {!isMobileView && (
            <Box
              sx={{
                visibility: currentPage < 8 ? "visible" : "hidden",
              }}
            >
              {
                //  posted
                isFetchingData && bookid ? (
                  documentData &&
                  documentData.images.length % 2 == 1 &&
                  currentPage == documentData.images.length - 1 ? (
                    ""
                  ) : (
                    <StackedRigth></StackedRigth>
                  )
                ) : (
                  // unposted

                  images &&
                  images.length > 0 &&
                  (images.length % 2 == 1 &&
                  currentPage == images.length - 1 ? (
                    ""
                  ) : (
                    <StackedRigth />
                  ))
                )
              }
            </Box>
          )}
        </Stack>

        {!isMobileView && (
          <Box
            sx={{
              position: "absolute",
              top: "1%",
              left: "4%",
              width: "10rem",
              height: "4rem",
              backgroundImage: `url(${
                isFetchingData && bookid ? documentData?.logo : logoTemp
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {!isFetchingData && logoTemp == null && (
              <Box
                sx={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: "1.5rem",
                  width: "10rem",
                  height: "4rem",
                  // border:'1px dotted',
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#f3f3f3",
                }}
              >
                Your Logo
              </Box>
            )}
          </Box>
        )}
        {/* ------------------------------ background Audio ICon--------------------------------- */}
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "4%",
          }}
        >
          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src={
              isFetchingData && bookid
                ? documentData?.backgroundAudio
                : audioFile
            }
            autoPlay
            loop
            preload="auto"
          ></audio>

          {/* Speaker icon to control mute/unmute */}
          {!isMobileView && (
            <IconButton
              sx={{
                borderRadius: "50%",
                border: `1px solid ${
                  isFetchingData && bookid
                    ? documentData?.coverColor
                    : coverColor
                }`,
              }}
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <VolumeOff
                  sx={{
                    color:
                      isFetchingData && bookid
                        ? documentData?.spineColor
                        : spineColor,
                  }}
                />
              ) : (
                <VolumeUp
                  sx={{
                    color:
                      isFetchingData && bookid
                        ? documentData?.coverColor
                        : coverColor,
                  }}
                />
              )}
            </IconButton>
          )}
        </div>
      </Box>

      {/* -------------------------------- Navigation container--------------------------- */}
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
            mt:1,
            display: "flex", // Flexbox for layout
            justifyContent: "center", // Space between children
            alignItems: "center", // Vertically center content
            zIndex: 1000, // Ensure it appears above other content
          }}
        >
          <Box
            sx={{
              // bgcolor: "red",
              width:'10%'
              
            }}
          >
            <IconButton
              sx={{
                borderRadius: "50%",
                border: `1px solid ${
                  isFetchingData && bookid
                    ? documentData?.coverColor
                    : coverColor
                }`,
              }}
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <VolumeOff
                   fontSize="small"
                  sx={{
                    color:
                      isFetchingData && bookid
                        ? documentData?.spineColor
                        : spineColor,
                  }}
                />
              ) : (
                <VolumeUp
                fontSize="small"
                  sx={{
                    color:
                      isFetchingData && bookid
                        ? documentData?.coverColor
                        : coverColor,
                  }}
                />
              )}
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              display:"flex",
              // justifyContent:"center",
              alignItems:"center",
              paddingLeft:"10%"

            }}
          >
            <NavigationsButtons
              currentPage={currentPage}
              flipBookRef={flipBookRef}
              coverColor={
                isFetchingData && bookid ? documentData?.coverColor : coverColor
              }
              spineColor={
                isFetchingData && bookid ? documentData?.spineColor : spineColor
              }
              totalPage={
                isFetchingData && bookid
                  ? documentData?.images.length
                  : images?.length
              }
            />
          </Box>
        </Box>
      )}
      {!isMobileView && (
        <>
          <NavigationsButtons
            currentPage={currentPage}
            flipBookRef={flipBookRef}
            coverColor={
              isFetchingData && bookid ? documentData?.coverColor : coverColor
            }
            spineColor={
              isFetchingData && bookid ? documentData?.spineColor : spineColor
            }
            totalPage={
              isFetchingData && bookid
                ? documentData?.images.length
                : images?.length
            }
          />
        </>
      )}

      {/* -------------------------------------------Flip page Audios------------------------------------------ */}
      <audio
        ref={flipSoundRef}
        src="/page-flip-sound(2).mp3"
        preload="audio"
      ></audio>
    </Box>
  );
};

export default FlipbookView;
