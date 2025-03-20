import { Button, Stack} from "@mui/material";
import { Link } from "react-router-dom";
import {TableView, ContentCopy} from '@mui/icons-material';
type Props = {
  url: string;
  title: string;
  isSuccess: boolean;
  isCopy?: boolean;
  isShowingTable?:boolean
};

const Header = ({ isSuccess, title, url, isCopy = true ,isShowingTable=false}: Props) => {
  console.log('url:', url)
  return (
    <Stack direction={"row"} justifyContent={"end"} alignItems={"center"} mb={2}>
      <Stack
        direction={"row"}
        justifyContent={"end"}
        alignItems={"center"}
        gap={2}
      >
       { isShowingTable && <Link
          to="/table"
          style={{
            marginInline: "auto",
            border:'none',
            outline:"none"
          }}
        >
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              // paddingInline: "2rem",
              borderRadius: "1.6rem",

              bgcolor: "#1976d2",
              
              color: "#ffff",
              mt: 1,
            }}
          >
            Go to table
            <TableView sx={{
              mx:1
            }}></TableView>
          </Button>
        </Link>}

        <Button
          variant="contained"
          disabled={!isSuccess}
          sx={{
            textTransform: "none",
            // paddingInline: "2rem",
            borderRadius: "1.6rem",
            bgcolor: "#22B865",
            color: "#ffff",
            mt: 1,
          }}
          onClick={() =>
            isCopy
              ? navigator.clipboard.writeText(
                  `${import.meta.env.VITE_DEV_URL}/${url}`
                )
              : window.open(`${import.meta.env.VITE_DEV_URL}${url}`)
          }
        >

          {title}

          <ContentCopy sx={{
            mx:1
          }}/>
        </Button>
      </Stack>
    </Stack>
  );
};

export default Header;
