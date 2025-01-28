
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

export function adjustColorBrightness(color: string, percentage: number): string {
  const tempElement = document.createElement("div");
  tempElement.style.color = color;
  document.body.appendChild(tempElement);

  const computedColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);

  const rgbMatch = computedColor.match(/\d+/g);
  if (!rgbMatch || rgbMatch.length < 3) return color;

  const [r, g, b] = rgbMatch.map(Number);

  const newR = Math.max(0, Math.min(255, r * (1 - percentage)));
  const newG = Math.max(0, Math.min(255, g * (1 - percentage)));
  const newB = Math.max(0, Math.min(255, b * (1 - percentage)));

  return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
}


export const inputFields = [

  { id: 1, heading:" Upload the PDF", title: 'Upload File', subTitle: 'No file chosen', accept: 'application/pdf', type: 'file', },
  { id: 2, heading:"Add BG music", title: 'audio', subTitle: 'No audio chosen', accept: 'audio/*', type: 'file', },
  { id:3,heading:'Upload the logo',title:'Upload logo',subTitle:'No file chosen',accept:'image/*', type:'file'}

]