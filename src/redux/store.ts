// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { bookReducer } from "../redux/reducers/book";
import { backgroundReducer } from "./reducers/setBackground";

export const store = configureStore({
  reducer: {
    [bookReducer.name]: bookReducer.reducer,
    [backgroundReducer.name]: backgroundReducer.reducer,
  },
});


