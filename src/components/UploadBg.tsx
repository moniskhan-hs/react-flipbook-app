import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Stack, TextField } from "@mui/material";
import { setbackground } from "../redux/reducers/setBackground";

const UploadBg = () => {
  const [file, setFile] = useState<File | null>(null); // Type `File` for file objects
  const dispatch = useDispatch();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      const fileUrl = URL.createObjectURL(uploadedFile); // Create a temporary URL
      dispatch(setbackground(fileUrl)); // Dispatch the URL to Redux
    }
  };

  const handleSetBackground = () => {
    if (file) {
      console.log("file:", file);
      console.log("Background set:", file.name); // Debugging/logging
    } else {
      console.log("No file selected");
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        onChange={handleFileUpload}
        placeholder="Upload the background image"
        type="file"
        size="small"
        InputLabelProps={{ shrink: true }} // Ensures placeholder works with file input
      />

      <Button
        variant="contained"
        sx={{
          textTransform: "none",
        }}
        onClick={handleSetBackground} // Button triggers setting the background
        disabled={!file} // Disable button if no file is selected
      >
        Set Background
      </Button>
    </Stack>
  );
};

export default UploadBg;
