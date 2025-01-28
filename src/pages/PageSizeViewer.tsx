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
import toast from "react-hot-toast";
import { Document, Page } from "react-pdf";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import UploadBg from "../components/UploadBg";
import { db } from "../firebase";
import { setSelectedSize } from "../redux/reducers/book";
import { setbackground } from "../redux/reducers/setBackground";
import Header from "../Shared/Header";
import { adjustColorBrightness, inputFields } from "../utils/features";
import { convertFileToDataURL } from "../utils/upload/convertFiletoBase64";
import { uploadImageOnFirebase } from "../utils/upload/fire-base-storage";
import { uploadAudioOnFirebase } from "../utils/upload/uploadAudio";
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
  const [isCoverColorPickerVisible, setIsCoverColorPickerVisible] =
    useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueBookId, seetUniqueBookId] = useState<string>();
  const [heigthOfBook, setHeigthOfBook] = useState<number>();
  const [widthOfBook, setWidthOfBook] = useState<number>();
  const [audioFile, setAudioFile] = useState<string | null>();
  const [logo,setLogo] = useState<string | null>()
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else if (type === "audio/*") {
      console.log("audio selected");
      const audioURL = await convertFileToDataURL(uploadedFile!);
      setAudioFile(audioURL);
    } else if (type === "image/*"){
      const logoURL = await convertFileToDataURL(uploadedFile!);
      setLogo(logoURL)
      console.log("image logo selected");

    } else {
      toast.error("Please upload a valid PDF file.");
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
    const bookName = file && file.name;
    setIsLoading(true);
    setIsSuccess(false);

    if (file) {
      try {
        // Use Promise.all to upload all images, background image, and audio concurrently
        const [uploadedImages, backgroundImageURl, backgroundAudio,logoURL] =
          await Promise.all([
            // Upload images
            Promise.all(
              images.map(async (ele) => {
                try {
                  const downloadLink = await uploadImageOnFirebase(
                    ele.dataUrl,
                    bookName as string
                  );
                  return downloadLink;
                } catch (err) {
                  console.log("Error uploading image:", err);
                  return ""; // Handle errors gracefully
                }
              })
            ),
            // Upload background image (if present)
            backgroundImage
              ? uploadImageOnFirebase(backgroundImage, bookName as string)
              : Promise.resolve(""),
            // Upload audio file (if present)
            audioFile
              ? uploadAudioOnFirebase(audioFile, bookName as string)
              : Promise.resolve(""),


              logo?uploadImageOnFirebase(logo,bookName as string) : Promise.resolve('')
          ]);

        // Post the data to Firestore
        const docRef = await addDoc(collection(db, "flipbooks"), {
          name: bookName,
          images: uploadedImages,
          background: backgroundImageURl,
          heigthOfBook,
          widthOfBook,
          coverColor,
          spineColor,
          backgroundAudio,
          logo:logoURL
        });

        // Set unique book ID for sharing
        seetUniqueBookId(docRef.id as string);

        console.log("Data successfully added to Firestore");
        setIsSuccess(true);
      } catch (error) {
        console.error("Error during upload:", error);
        toast.error("Failed to upload data");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("No file provided!");
      setIsSuccess(false);
      toast.error("No file is selected");
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
        overflow:'auto',
        padding: "0rem 2rem ",
      }}
    >
      {/* ------------Left size menu------------ */}
      <Box
        sx={{
          width: "20%",
          height:"100vh",
          overflowY: "auto",
        }}
      >
        <Stack
        height={'auto'}
        overflow = 'auto'
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
            {inputFields.map((ele) => {
              return (
                <Stack direction="column" key={ele.id} spacing={2}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    {ele.heading}
                  </Typography>
                  {/* ------------------Upload pdf file------------------ */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
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
                      {ele.title}
                      <input
                        type={ele.type}
                        accept={ele.accept}
                        onChange={(e) => handleFileUpload(e, ele.accept)}
                        hidden
                        required
                      />
                    </Button>
                    <span>{ele.subTitle}</span>
                  </Box>
                </Stack>
              );
            })}

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
                mt: 2,
                mx: "auto",
              }}
              onClick={uploadToFirebase}
            >
              {isLoading ? (
                <CircularProgress />
              ) : isSuccess ? (
                "Saved!"
              ) : (
                "Save Changes"
              )}
            </Button>
            <Link to="/table" style={{
              marginInline:'auto'
            }}>
              <Button variant="text" sx={{
                textTransform: "none",

              }}>Go to table</Button>
            </Link>
         
          </Stack>

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
        <Header
          isSuccess={isSuccess}
          url={`book/bookId/${uniqueBookId}`}
          title="Copy URL"
        />

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
            logoTemp={logo}
            audioFile = {audioFile ? audioFile:''}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PdfToImages;
