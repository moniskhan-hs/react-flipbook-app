import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Document, Page} from "react-pdf";
import { useDispatch } from "react-redux";
import UploadBg from "../components/UploadBg";
import { db } from "../firebase";
import { setSelectedSize } from "../redux/reducers/book";
import { setbackground } from "../redux/reducers/setBackground";
import Header from "../Shared/Header";
import { adjustColorBrightness } from "../utils/features";
import {
  uploadImageOnFirebase
} from "../utils/upload/fire-base-storage";
import FlipbookView from "./Flipbook";

const PdfToImages = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [images, setImages] = useState<
    { dataUrl: string; width: number; height: number }[]
  >([]);
  const [file, setFile] = useState<File | null>(null);
  const [coverColor, setCoverColor] = useState("#aabbcc");
  const dispatch = useDispatch();
  const processedPages = useRef<Set<number>>(new Set());
  // const navigate = useNavigate();
  const [isCoverColorPickerVisible, setIsCoverColorPickerVisible] =
    useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueBookId, seetUniqueBookId] = useState<string>();
  const [heigthOfBook, setHeigthOfBook] = useState<number>();
  const [widthOfBook, setWidthOfBook] = useState<number>();
  //---------------------- Globals variables ----------------------

  //----------------------- A L L   M E T H O D S   OR   H A N D L E R S -----------------------

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setImages([]); // Reset images when a new document is loaded
    localStorage.setItem("pdf_images", JSON.stringify([])); // Clear existing images array from local storage
    processedPages.current.clear();
    dispatch(
      setSelectedSize({
        width: 0,
        height: 0,
      })
    );
  };
  // ---------------------------------- method to upload the PDF--------------

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // ---------------------------------- method to capute the imgage of each PDF's page------------------

  const capturePageAsImage = (
    pageNumber: number,
    canvas: HTMLCanvasElement | null
  ) => {
    if (!canvas || processedPages.current.has(pageNumber)) return;

    processedPages.current.add(pageNumber); // Mark page as processed

    // Ensure canvas is ready
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png", 1.0); // High-quality image
      const { width, height } = canvas;
      setHeigthOfBook(height);
      setWidthOfBook(width);
      // --------------------------------------------------------------------------
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
      } else if (availableWidth < 0 && availableHeigth < 0) {
        console.log("heigth - width -");

        if (width > height) {
          const newWidthOfFlipbook = (window.innerWidth / 2) * 0.9;
          // const negativeValueTopositive = Math.abs(availableWidth);
          console.log("newWidthOfFlipbook:", newWidthOfFlipbook);

          const newHeigthOFflipbook = newWidthOfFlipbook / aspectRationOfBook;
          console.log("newHeigthOFflipbook:", newHeigthOFflipbook);

          dispatch(
            setSelectedSize({
              width: newWidthOfFlipbook,
              height: newHeigthOFflipbook,
            })
          );
        } else {
          const newHeigthOFflipbook = window.innerHeight * 0.9;
          console.log("newHeigthOFflipbook:", newHeigthOFflipbook);

          const newWidthOfFlipbook = aspectRationOfBook * newHeigthOFflipbook;
          console.log("newWidthOfFlipbook:", newWidthOfFlipbook);
          dispatch(
            setSelectedSize({
              width: newWidthOfFlipbook,
              height: newHeigthOFflipbook,
            })
          );
        }
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

      setImages((prev) => {
        const updated = [...prev];
        updated[pageNumber - 1] = { dataUrl, width, height };
        return updated;
      });

      // Save to local storage
      const storedImages = JSON.parse(
        localStorage.getItem("pdf_images") || "[]"
      );

      storedImages[pageNumber - 1] = dataUrl;
      localStorage.setItem("pdf_images", JSON.stringify(storedImages));
      console.log(`Page ${pageNumber} saved to localStorage.`);
      // dispatch(setSelectedSize({ width, height }));
    }, 100);
  };

  // ---------------------------------- Handle to change the background image---------------------

  const hanldeBackgroundChange = (value: string | null) => {
    if (value) {
      setBackgroundImage(value);
      dispatch(setbackground(value));
    } else {
      console.log("no background images is selected");
    }
  };
  // ---------------------------------- method to upload the images and  background image on firestore---------------

  const uploadToFirebase = async () => {
    //steps
    // 1. post the images on firestorage
    // 2.and then post on cloud storage with downloadbale URL and
    const bookName = file && file.name;
    setIsLoading(true);
    setIsSuccess(false);
    if (file) {
      // Use Promise.all with map to wait for all uploads to finish
      const uploadedImages: string[] = await Promise.all(
        images.map(async (ele) => {
          try {
            const downloadLink = await uploadImageOnFirebase(
              ele.dataUrl,
              bookName as string
            );
            return downloadLink; // Return the download link for Promise.all to resolve
          } catch (err) {
            console.log("err", err);
            return ""; // Handle errors gracefully (optional: filter later)
          }
        })
      );

      let backgroundImageURl;

      if (backgroundImage) {
        backgroundImageURl = await uploadImageOnFirebase(
          backgroundImage,
          bookName as string
        );
      }

      // Post the data to Firestore
      const docRef = await addDoc(collection(db, "flipbooks"), {
        name: bookName, // book Name
        images: uploadedImages, // All uploaded images
        background: backgroundImageURl || "", // Background image
        heigthOfBook,
        widthOfBook,
        coverColor,
        spineColor,
      });

      //  res.id = unique book id ==> wil be saved in URL to get the sharable link
      seetUniqueBookId(docRef.id as string);

      console.log("Data successfully added to Firestore");
      setIsSuccess(true);
      setIsLoading(false);
    } else {
      console.error("No file provided!");
      setIsSuccess(false);
    }
  };

  // ---------------------------------- method to copy the url into clipboard ---------------
  const spineColor = adjustColorBrightness(coverColor, 0.5);
  console.log("spineColor:", spineColor);

  // ----------------------------------- fetch the data for a book--------------------------------

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        padding: "0rem 2rem ",
      }}
    >
      {/* ------------Left size menu------------ */}
      <Box
        sx={{
          width: "20%",
          overflow: "auto",
          // padding={'1rem 0.5rem'}
        }}
      >
        <Stack
          // direction={"row"}
          display={"flex"}
          alignItems={"center"}
          gap={5}
          border={"1px solid rgba(0, 0, 0, 0.25)"}
          justifyContent={"center"}
          sx={{
            borderRadius: "8px",
            padding: "1rem 1.3rem",
            mt: 2,
          }}
        >
          <Stack direction={"column"} gap={2} alignItems={"start"} sx={{}}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Upload the PDF{" "}
            </Typography>
            {/* ------------------Upload pdf file------------------ */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "10px 20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Button
                variant="contained"
                component="label"
                startIcon={<i className="fas fa-upload"></i>}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#e8f0fe",
                  color: "#1976d2",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  ":hover": { backgroundColor: "#d7e6fd" },
                }}
              >
                Upload File
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  hidden
                />
              </Button>
              <span>No file chosen</span>
            </Box>

            {/* --------------------- upload the backround image ------------------------------- */}
            <UploadBg onBackgroundChange={hanldeBackgroundChange} />
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Choose the color
            </Typography>

            <Stack direction={"row"} gap={1} width={"100%"}>
              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={"bold"}>
                  Cover
                </Typography>

                <Button
                  variant={isCoverColorPickerVisible ? "contained" : "text"}
                  sx={{
                    width: "2rem",
                    height: "2rem",
                    bgcolor: coverColor,
                  }}
                  onClick={() => {
                    setIsCoverColorPickerVisible(true);
                  }}
                ></Button>
              </Box>

              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={"bold"}>
                  Spine
                </Typography>
                <Button
                  disabled
                  sx={{
                    width: "2rem",
                    height: "2rem",
                    bgcolor: adjustColorBrightness(coverColor, 0.5),
                    //0.5=== 50% darker
                  }}
                ></Button>
              </Box>
            </Stack>

            {/* ----------------------- set the cover color---------------------------- */}
            <Box mx={"auto"}>
              <HexColorPicker color={coverColor} onChange={setCoverColor} />
            </Box>

            {/* -------------------------- Save button---------------------------------- */}
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                paddingInline: "2rem",
                borderRadius: "1.6rem",
                my: 2,
                mx: "auto",
              }}
              onClick={uploadToFirebase}
            >
              {isLoading ? (
                <CircularProgress />
              ) : isSuccess ? (
                "Success!"
              ) : (
                "Save Changes"
              )}
            </Button>
          </Stack>

          {/* -------------------set background image----------------- */}
        </Stack>

        {/* ---------------------- render the pdf pages [display none ] */}
        <Box display={"none"}>
          {file ? (
            <Document
              // file={interiorPdf} //static pdf for demo purpose
              file={file} // dynamic pdf upload
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<p>Loading PDF...</p>}
              error={<p>Failed to load PDF.</p>}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <div key={i}>
                  <Typography>Rendering Page {i + 1}</Typography>
                  <Page
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    pageNumber={i + 1}
                    canvasRef={(canvas) => capturePageAsImage(i + 1, canvas)}
                  />
                </div>
              ))}
            </Document>
          ) : (
            <Typography textAlign={"center"} mt={5}>
              Please upload a valid PDF file to view it.
            </Typography>
          )}
        </Box>
      </Box>

      {/* -----------------Preview Section---------------- */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Header isSuccess={isSuccess} url={`book/bookId/${uniqueBookId}`} title="Copy URL" />


          <Box
            sx={{
              // transform: "scale(0.9)",
              transformOrigin: "top",
              width: "100%",
              height: "100%",
              overflow: "auto",
              mb: 3,
            }}
          >
            <FlipbookView
              isFetchingData={false}
              images={images}
              backgroundTemp={backgroundImage}
              coverColor={coverColor}
              spineColor={spineColor}
            />
          </Box>
      
      </Box>
    </Box>
  );
};

export default PdfToImages;
