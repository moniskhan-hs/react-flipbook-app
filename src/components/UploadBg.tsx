import { Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
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



  return (
    <Stack direction="row" spacing={2}>
      <TextField
        onChange={handleFileUpload}
        placeholder="Upload the background image"
        type="file"
        size="small"
        InputLabelProps={{ shrink: true }} // Ensures placeholder works with file input
      />
    </Stack>
  );
};

export default UploadBg;
