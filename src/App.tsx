
import { pdfjs } from 'react-pdf';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DemoBook from "./pages/Home";
import PdfToImages from "./pages/PageSizeViewer";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const App = () => {


  
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route path="/" element={<DemoBook/>}/>
        <Route path="/upload" element={<PdfToImages />}/>
      </Routes>
    </Router>
  )
}

export default App
