// features/bookSlice.ts
import { createSlice } from "@reduxjs/toolkit";



  
  const initialState: BackgroundInitStateTyoe = {
    background: null, 
  };

export const backgroundReducer = createSlice({
  name: "backgroundReducer",
  initialState,
  reducers: {
    setbackground(state, action) {
      console.log('background reducer called')
      state.background = action.payload
     
    },
  },
});

export const { setbackground } = backgroundReducer.actions;
