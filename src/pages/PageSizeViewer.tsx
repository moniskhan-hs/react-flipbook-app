import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Document, Page, pdfjs } from "react-pdf";
import { useDispatch } from "react-redux";
import UploadBg from "../components/UploadBg";
import { setSelectedSize } from "../redux/reducers/book";

// Set the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfToImages = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [images, setImages] = useState<
  { dataUrl: string; width: number; height: number }[]
  >([]);
  console.log('images:', images)
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState(""); // Stores the input URL
  const [coverColor, setCoverColor] = useState("#aabbcc");
  const [spineColor, setSpineColor] = useState("#aabbcc");
  const dispatch = useDispatch();
  const processedPages = useRef<Set<number>>(new Set());
  // const navigate = useNavigate();
  const [isCoverColorPickerVisible, setIsCoverColorPickerVisible] =
    useState(true);

  //----------------------- Handlers-----------------------

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

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const uploadedFile = event.target.files?.[0];
  //   if (uploadedFile && uploadedFile.type === "application/pdf") {
  //     setFile(uploadedFile);
  //   } else {
  //     alert("Please upload a valid PDF file.");
  //   }
  // };

  const capturePageAsImage = (
    pageNumber: number,
    canvas: HTMLCanvasElement | null
  ) => {
    if (!canvas || processedPages.current.has(pageNumber)) return;

    // const width = canvas.width;
    // console.log('canvas.width:', canvas.width)
    // const height = canvas.height;
    // console.log('canvas.height:', canvas.height)
    processedPages.current.add(pageNumber); // Mark page as processed

    // Ensure canvas is ready
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png", 1.0); // High-quality image
      const { width, height } = canvas;
      console.log("height inside the setTimout :", height);
      console.log("width inside the setTimout:", width);

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

  // ------------------------------ download pdf from the URL-------------------------
  const fetchPdf = async () => {
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log("blobUrl:", blobUrl);
          {/* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */}
      setFile(blobUrl);
      // navigate("/");
    } catch (error) {
      console.error("Error fetching PDF:", error);
      setFile(null); // Reset file if there's an error
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
      }}
    >
      {/* ------------Left size menu------------ */}
      <Box
        sx={{
          width: "30%",
        }}
      >
        <Stack
          // direction={"row"}
          alignItems={"center"}
          mt={5}
          gap={5}
          justifyContent={"center"}
        >
          <Paper elevation={5}>
            <Stack
              direction={"column"}
              gap={2}
              alignItems={"start"}
              sx={{
                padding :'1rem 1.5rem'
              }}
            >
              {/* ------------------Upload pdf file------------------ */}
              {/* <Box
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
                startIcon={<i className="fas fa-upload"></i>} // Replace with an upload icon if you want
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
            </Box> */}
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Paste your PDF link here
              </Typography>
              <TextField
                fullWidth
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="Enter pdf url link"
                size="small"
              />
              {/* --------------------- upload the backround image ------------------------------- */}
              <UploadBg />

              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Choose the color of{" "}
                {isCoverColorPickerVisible ? "'cover'" : "'spine'"}
              </Typography>
              <Stack direction={"row"} gap={1} width={"100%"}>
                <Button
                  variant={isCoverColorPickerVisible ? "contained" : "text"}
                  sx={{
                    flex: 1,
                    bgcolor: coverColor,
                  }}
                  onClick={() => {
                    setIsCoverColorPickerVisible(true);
                  }}
                >
                  Cover
                </Button>
                <Button
                  // variant={!isCoverColorPickerVisible ? "contained" : "text"}
                  sx={{
                    flex: 1,
                    bgcolor: spineColor,
                  }}
                  onClick={() => {
                    setIsCoverColorPickerVisible(false);
                  }}
                >
                  Spine
                </Button>
              </Stack>

              {/* ----------------------- set the cover color---------------------------- */}
              <Box mx={"auto"}>
                <HexColorPicker
                  color={isCoverColorPickerVisible ? coverColor : spineColor}
                  onChange={
                    isCoverColorPickerVisible ? setCoverColor : setSpineColor
                  }
                />
              </Box>

              {/* -------------------------- Save button---------------------------------- */}
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  paddingInline: "2rem",
                  borderRadius: "1.6rem",
                  my: 2,
                  mx: "auto",
                }}
                onClick={fetchPdf}
              >
                Save Changes
              </Button>
            </Stack>
          </Paper>

          {/* -------------------set background image----------------- */}

          {/* <Link to={"/"}> */}

          {/* </Link> */}
        </Stack>

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

        {/* <div style={{ marginTop: 20, textAlign: "center" }}>
        <Typography variant="h6">Extracted Images:</Typography>
        {images.length > 0 ? (
          images.map(({ dataUrl, width, height }, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              <Typography>
                Page {index + 1}: Width: {width}px, Height: {height}px
              </Typography>
              <img
                src={dataUrl}
                alt={`Page ${index + 1}`}
                style={{ width: `${width}px`, height: `${height}px` }}
              />
            </div>
          ))
        ) : (
          <p>No images available yet.</p>
        )}
      </div> */}
      </Box>
      {/* -----------------Preview Section---------------- */}
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Stack direction={"row"} justifyContent={"end"} alignItems={"center"}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              paddingInline: "2rem",
              borderRadius: "1.6rem",
              bgcolor: "lightblue",
              color: "black",
              m: 2,
            }}
          >
            Copy URL
          </Button>
        </Stack>

        <Box height={"100%"}>
          <iframe
            src={`http://localhost:5173/?t=${Date.now()}`}
            style={{ width: "100%", height: "90vh", border: "none" }}
            sandbox="allow-scripts allow-same-origin"
            title="Iframe Example"
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
};

export default PdfToImages;
