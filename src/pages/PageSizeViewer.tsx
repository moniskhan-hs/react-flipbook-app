

import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedSize } from "../redux/reducers/book";

// Set the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfToImages = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useDispatch()



  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setImages([]); // Reset images when a new document is loaded
     // Clear existing images array from local storage when a new document is loaded
     localStorage.setItem("pdf_images", JSON.stringify([]));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const capturePageAsImage = async (
    pageNumber: number,
    canvas: HTMLCanvasElement | null
  ) => {
    if (canvas) {
      setTimeout(() => {
        
        // Get canvas dimensions
        const width = canvas.width;
        const height = canvas.height;
        

  dispatch(setSelectedSize({width,height}))

        // Ensure the canvas has the correct dimensions before capturing
        const dataUrl = canvas.toDataURL("image/png", 1.0); // 1.0 ensures maximum quality
        setImages((prev) => {
          const updated = [...prev];
          updated[pageNumber - 1] = { dataUrl, width, height }; // Store the image along with dimensions
          return updated;
        });
 // Retrieve the current images array from local storage
 const storedImages = JSON.parse(localStorage.getItem("pdf_images") || "[]");

 // Update the images array with the new page image
 storedImages[pageNumber - 1] = dataUrl;

 // Save the updated array back to local storage
 localStorage.setItem("pdf_images", JSON.stringify(storedImages));      }, 10);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        style={{ marginBottom: "20px" }}
      />

<Link to={'/'}>
<Button variant="contained" sx={{
  textTransform:'none'
}}>Home</Button>
</Link>


      {file ? (
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p>Loading PDF...</p>}
          error={<p>Failed to load PDF.</p>}
        >
          {/* Render each page and capture its image */}
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
        <Typography>Please upload a valid PDF file to view it.</Typography>
      )}

      {/* Display extracted images */}
      <div style={{ marginTop: 20 }}>
        <Typography variant="h6">Extracted Images:</Typography>
        {images.length > 0 ? (
          images.map(({ dataUrl, width, height }, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              <Typography>Page {index + 1}</Typography>
              <img
                src={dataUrl} // Use the data URL directly
                alt={`Page ${index + 1}`}
                style={{ width: `${width}px`, height: `${height}px` }}
              />
            </div>
          ))
        ) : (
          <p>Images are being generated...</p>
        )}
      </div>
    </div>
  );
};

export default PdfToImages;
