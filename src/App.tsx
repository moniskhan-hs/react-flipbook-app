import { pdfjs } from "react-pdf";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import DemoBook from "./pages/Home";
import { onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase";
import GridTable from "./pages/GridTable";
import Loader from "./Shared/Loader";
// import PdfToImages from "./pages/PageSizeViewer";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();
// const imgPath = path.join(process.cwd(), 'public', '90x50/pc_001jpg');
if (import.meta.env.PROD) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://server-worker.vercel.app/public/pdf.min.mjs';
} else {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
}


console.log('pdfjs.GlobalWorkerOptions.workerSrc:', pdfjs.GlobalWorkerOptions.workerSrc)
const FlipbookView = lazy(() => import("./pages/Flipbook"));
const PdfToImages = lazy(() => import("./pages/PageSizeViewer"));

const App = () => {
  // const navigate = useNavigate();
  const [isLoggedUser, setIsLoggedUser] = useState<boolean>();

  useEffect(() => {
    // user= firebase retured user
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("user:", user);
        // not able to navigate from here
        // setIsLoggedUser(true)
        //  <Navigate to={'/table'} />
        // window.location.href('/table')
        // window.open('http://localhost:5173/table')
      } else {
        setIsLoggedUser(false);
      }
    });
  }, []);

  console.log("isLoggedUser:", isLoggedUser);
  /// check use is authe or not

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
          {/* <Route
            element={
              <Pr̥otectedRoute
                isAuthenticated={isLoggedUser ? true : false}
                redirect="/backend/web/firebase-login"
              /> // redirect to the un-authenticate user to login route [/ in this case]
            }
          >
          </Route> */}
                  <Route path="/" element={<Navigate to="/upload" replace />} />

            <Route path="/table" element={<GridTable />} />
          <Route path="/upload" element={<PdfToImages />} />
          {/* -------------------------------- your login route--------------------------- */}
          {/* <Route path="/differentRoute" element={<LoginComponent />} /> */}
          {/* <Route path="/" element={


<h2> User is login here </h2>

          } /> */}
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </Router>
  );
};

export default App;
