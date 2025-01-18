// features/bookSlice.ts
import { createSlice } from "@reduxjs/toolkit";



  
  const initialState: BackgroundInitStateTyoe = {
    background: null, // Default value
  };

export const backgroundReducer = createSlice({
  name: "backgroundReducer",
  initialState,
  reducers: {
    setbackground(state, action) {
      state.background = action.payload
     
    },
  },
});

export const { setbackground } = backgroundReducer.actions;
