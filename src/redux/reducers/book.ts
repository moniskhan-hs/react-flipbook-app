// features/bookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: BookStateInitState = {
  selectedSize:  { type: "Default Book", dimensions: { width: 450, height: 600 } },
  // selectedSize:  { type: "Default Book", dimensions: { width: 520, height: 800 } },
};

export const bookReducer = createSlice({
  name: "book",
  initialState,
  reducers: {
    setSelectedSize(state, action: PayloadAction<SelectedBookType>) {
      state.selectedSize = action.payload;
    },
  },
});

export const { setSelectedSize } = bookReducer.actions;
