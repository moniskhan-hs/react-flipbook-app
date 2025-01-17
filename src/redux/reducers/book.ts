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
      state.width = action.payload.width;
      state.height = action.payload.height
    },
  },
});

export const { setSelectedSize } = bookReducer.actions;
