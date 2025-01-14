import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { theme } from "./utils/theme.ts";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
    <App />
  </Provider>,
  </ThemeProvider>
);
