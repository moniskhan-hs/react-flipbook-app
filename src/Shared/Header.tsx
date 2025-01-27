import { Button, Stack } from "@mui/material";

type Props = {
  url: string;
  title: string;
  isSuccess: boolean;
  isCopy?: boolean;
};

const Header = ({ isSuccess, title, url, isCopy = true }: Props) => {
  return (
    <Stack direction={"row"} justifyContent={"end"} alignItems={"center"}>
      <Button
        variant="contained"
        disabled={!isSuccess}
        sx={{
          textTransform: "none",
          paddingInline: "2rem",
          borderRadius: "1.6rem",
          bgcolor: "lightblue",
          color: "black",
          mt: 1,
        }}
        onClick={() =>
          isCopy
            ? navigator.clipboard.writeText(`${import.meta.env.VITE_DEV_URL}/${url}`)
            :  window.open( `${import.meta.env.VITE_DEV_URL}${url}`)
        }
      >
        {title}
      </Button>
    </Stack>
  );
};

export default Header;
