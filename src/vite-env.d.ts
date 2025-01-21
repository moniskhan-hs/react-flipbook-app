/// <reference types="vite/client" />

declare module "pdfjs-dist/build/pdf.worker.entry" {
  const workerSrc: string;
  export default workerSrc;
}


type BookStateInitState  =  { width: number; height: number } 
  
  
  interface PageSize {
    width: number;
    height: number;
  }
  
  interface PdfPageSizeViewerProps {
    pdfUrl: string;
  }
  
  interface BackgroundInitStateTyoe {
    background: string | null; // The background can now hold a File object
  }

  type HTMLFlipBookRef = {
    pageFlip: () => {
      getPageCount: () => number;
      turnToPage: (pageIndex: number) => void;
    };
  };