import { Button, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { setSelectedSize } from "../redux/reducers/book";
import { bookSizes } from "../utils/data";

const Controls = () => {
  const dispatch = useDispatch();

  const handleSelectSize = (book: {
    type: string;
    dimensions: { width: number; height: number };
  }) => {
    dispatch(setSelectedSize(book));
    // alert(`Selected Book: ${book.type}`);
  };
  return (
    <Stack direction={"row"} justifyContent={"start"} alignItems={"center"}>
      <Stack direction={"row"} gap={5}>
        {/* <Button variant="outlined"> Set Cover Page Image</Button>

        <Button variant="outlined"> Drawing Book</Button>

        <Button variant="outlined"> Normal Book</Button> */}

        <div style={{ padding: "20px" }}>
          <h2>Select a Book Size</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {bookSizes.map((book) => (
              <Button
                key={book.type}
                variant="contained"
                sx={{
                  padding: "10px 15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  // backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                  textTransform:"none"
                }}
                onClick={() => handleSelectSize(book)}
              >
                {book.type}
              </Button>
            ))}
          </div>
        </div>
      </Stack>
    </Stack>
  );
};

export default Controls;
