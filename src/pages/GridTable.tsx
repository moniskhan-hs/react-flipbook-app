import { Launch } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Header from "../Shared/Header";

export default function GridTable() {
  const [booksData, setBooksData] = useState<BookDataFromFirestoreType[] | []>(
    []
  );

  //----------------------- Fetching the data from Firestore Database-------------------------------

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "flipbooks"));
      //   console.log('querySnapshot:', querySnapshot)
      const allData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Document data);
      }));
      console.log("allData:", allData);
          {/* @ts-expect-error: This error is intentional because the type mismatch is handled elsewhere */}
          setBooksData(allData);
    };

    fetchData();
  }, []);
  //----------------------------------- ------------------ Table Contents--------------------------------------

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Book Name",
      flex: 5,
    },
    {
      field: "link",
      headerName: "Link",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // Prevent row selection when clicking the icon
              window.open(params.row.link, "_blank");
            }}
          >
            <Launch />
          </IconButton>
        );
      },
    },
  ];

  const rows = booksData.map((ele,index) => ({
    id: index+1,
    name: ele.name,
    link: `book/bookId/${ele.id}`,
  }));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
      >
        {/* -------------------------------- header----------------------------- */}
  <Header isSuccess = {true} title="Create New Book"  url={'/upload'} isCopy = {false}/>

        {/* -------------------------------- Grid----------------------------- */}
      <Box sx={{ height: 400, width: "80%", mx: "auto", my: 5 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
