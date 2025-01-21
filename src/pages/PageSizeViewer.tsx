import { Button, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import interiorPdf from "/Pocket.pdf";
import UploadBg from "../components/UploadBg";
import { setSelectedSize } from "../redux/reducers/book";

// Set the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfToImages = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [images, setImages] = useState<
    { dataUrl: string; width: number; height: number }[]
  >([]);
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useDispatch();
  const processedPages = useRef<Set<number>>(new Set());

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

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

  return (
    <div>
      <Stack
        direction={"row"}
        alignItems={"center"}
        mt={5}
        gap={5}
        justifyContent={"center"}
      >
        <Stack direction={"row"} gap={2}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            style={{ marginBottom: "20px" }}
          />
        </Stack>

        <UploadBg />

        <Link to={"/"}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              paddingInline: "2rem",
            }}
          >
            Home
          </Button>
        </Link>
      </Stack>

      {file ? (
        <Document
          file={interiorPdf} //static pdf for demo purpose
          // file={file}    // dynamic pdf upload
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



      <div style={{ marginTop: 20, textAlign: "center" }}>
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
      </div>
    </div>
  );
};

export default PdfToImages;

