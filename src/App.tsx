import { pdfjs } from "react-pdf";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import DemoBook from "./pages/Home";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import GridTable from "./pages/GridTable";
import LoginPage from "./pages/LoginPage";
import Loader from "./Shared/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Pr̥otectedRoute from "./components/ProtectedRoutes";
// import PdfToImages from "./pages/PageSizeViewer";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const FlipbookView = lazy(() => import("./pages/Flipbook"));
const PdfToImages = lazy(() => import("./pages/PageSizeViewer"));

const App = () => {
  const [isLoggedUser, setIsLoggedUser] = useState(false);

  useEffect(() => {
    // user= firebase retured user
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("user:", user);
        setIsLoggedUser(true);
      } else {
        console.log("no user is there");
        setIsLoggedUser(false);
      }
    });
  }, []);

  return (
    <Router>
      <Suspense fallback={<Loader></Loader>}>
        <Routes>
          {/* <Route path="/" element={<Home/>}/> */}
          <Route
            path="/book/bookId/:bookid"
            element={<FlipbookView isFetchingData={true} />}
          />
          {/* --------------------------------------protected routes---------------- */}
          <Route
            element={
              <Pr̥otectedRoute isAuthenticated={isLoggedUser ? true : false}  redirect="/"/>  // redirect to the un-authenticate user to login route [/ in this case]
            }
          >
            <Route path="/upload" element={<PdfToImages />} />
            <Route path="/table" element={<GridTable />} />
          </Route>
          {/* -------------------------------- your login route--------------------------- */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </Router>
  );
};

export default App;
