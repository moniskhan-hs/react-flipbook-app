import { Box, Button, Stack, Typography } from "@mui/material";
import React, { Dispatch } from "react";
import { HexColorPicker } from "react-colorful";
import { adjustColorBrightness } from "../../utils/features";

type Props = {
  isCoverColorPickerVisible: boolean;
  setIsCoverColorPickerVisible: Dispatch<React.SetStateAction<boolean>>;
  coverColor: string;
  setCoverColor: Dispatch<React.SetStateAction<string>>;
};

const ColorPicker = ({
  coverColor,
  isCoverColorPickerVisible,
  setCoverColor,
  setIsCoverColorPickerVisible,
}: Props) => {
  return (
    <>
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
    </>
  );
};

export default ColorPicker;
