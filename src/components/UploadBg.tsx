import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setbackground } from "../redux/reducers/setBackground";
import { convertFileToDataURL } from "../utils/upload/convertFiletoBase64";

type Props = {
  onBackgroundChange: (value: string | null) => void;
};

const UploadBg = ({ onBackgroundChange }: Props) => {
  const [file, setFile] = useState<File | null>(null); // Type `File` for file objects
  console.log("file:", file);
  const dispatch = useDispatch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const url = await convertFileToDataURL(uploadedFile);
      dispatch(setbackground(url))
      onBackgroundChange(url);
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        Add the background Image
      </Typography>
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
          Upload Image
          <input
            type="file"
            // accept="application/pdf"
            onChange={handleFileUpload}
            hidden
          />
        </Button>
        <span>No file chosen</span>
      </Box>
    </Stack>
  );
};

export default UploadBg;
