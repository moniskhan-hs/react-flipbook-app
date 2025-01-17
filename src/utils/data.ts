
export const bookSizes = [
  { type: "Default Book", dimensions: { width: 450, height: 600 } },
  { type: "Read Book", dimensions: { width: 380, height: 540 } },
  { type: "Pocket Book", dimensions: { width: 250, height: 400 } },
    { type: "Photo Book", dimensions: { width: 600, height: 600 } },
    { type: "Drawing Book ", dimensions: { width: 500, height: 350 } },
    // { type: "Textbook (Standard)", dimensions: { width: 768, height: 1024 } },
    // { type: "Magazine", dimensions: { width: 800, height: 1000 } },
    // { type: "Photo Book (Square)", dimensions: { width: 900, height: 900 } },
  ];

  export function resizeBasedOnAspectRatio(width, height, scaleFactor) {
    const aspectRatio = width / height;
  
    // Increase width and height by the scaleFactor
    const newWidth = width * scaleFactor;
    const newHeight = newWidth / aspectRatio; // Maintain aspect ratio
  
    return { newWidth, newHeight };
  }