import { pdfjs } from "react-pdf";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import DemoBook from "./pages/Home";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import GridTable from "./pages/GridTable";
import LoginPage from "./pages/LoginPage";
import Loader from "./Shared/Loader";
// import PdfToImages from "./pages/PageSizeViewer";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const FlipbookView = lazy(()=>import('./pages/Flipbook'))
const PdfToImages = lazy(()=>import('./pages/PageSizeViewer'))

const App = () => {

  return (
    <Router>
      <Suspense fallback={<Loader></Loader>}>
      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route
          path="/book/bookId/:bookid"
          element={<FlipbookView isFetchingData={true} />}
        />
        <Route path="/upload" element={<PdfToImages />} />
        <Route path="/table" element = {<GridTable/>} />
        <Route path="/" element = {<LoginPage/>} />

      </Routes>
      </Suspense>
      <Toaster position="top-center"/>

    </Router>
  );
};

export default App;
