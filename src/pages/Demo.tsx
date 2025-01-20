import React, { useState, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip"; // Ensure this package is installed

interface PageProps {
  children: React.ReactNode;
  number?: number;
}

const PageCover = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <h2 className="page-header">Page header - {props.number}</h2>
        <div className="page-image"></div>
        <div className="page-text">{props.children}</div>
        <div className="page-footer">{props.number ? props.number + 1 : ""}</div>
      </div>
    </div>
  );
});

const DemoBook: React.FC = () => {
  const flipBookRef = useRef(null);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);

  const nextButtonClick = () => {
    flipBookRef.current?.getPageFlip()?.flipNext();
  };

  const prevButtonClick = () => {
    flipBookRef.current?.getPageFlip()?.flipPrev();
  };

  const onPage = (e: { data: number }) => {
    setPage(e.data);
  };

  useEffect(() => {
    if (flipBookRef.current) {
      // const pageCount = flipBookRef.current.getPageFlip()?.getPageCount() || 0;
      // setTotalPage(pageCount);
    }
  }, []);

  return (
    <div>
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onPage}
        className="demo-book"
        ref={flipBookRef}
      >
        <PageCover>BOOK TITLE</PageCover>
        <Page number={1}>Lorem ipsum...</Page>
        <Page number={2}>Lorem ipsum...</Page>
        {/* Add more pages as needed */}
        <PageCover>THE END</PageCover>
      </HTMLFlipBook>

      <div className="container">
        <div>
          <button type="button" onClick={prevButtonClick}>
            Previous page
          </button>

          [<span>{page}</span> of <span>{totalPage}</span>]

          <button type="button" onClick={nextButtonClick}>
            Next page
          </button>
        </div>

        <div>
          State: <i>{page}</i>, Total Pages: <i>{totalPage}</i>
        </div>
      </div>
    </div>
  );
};

export default DemoBook;
