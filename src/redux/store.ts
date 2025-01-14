// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { bookReducer } from "../redux/reducers/book";

export const store = configureStore({
  reducer: {
    [bookReducer.name]: bookReducer.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
