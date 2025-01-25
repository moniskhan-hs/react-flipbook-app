// features/bookSlice.ts
import { createSlice } from "@reduxjs/toolkit";


const initialState:BookStateInitState = {
 width: 450, height: 600
} 

export const bookReducer = createSlice({
  name: "book",
  initialState,
  reducers: {
    setSelectedSize(state, action) {
      state.width = action.payload.width || 450;
      state.height = action.payload.height || 600
      console.log("setSelectedSize called+++++++++")
    },
  },
});

export const { setSelectedSize } = bookReducer.actions;
