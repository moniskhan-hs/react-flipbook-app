/// <reference types="vite/client" />

type SelectedBookType ={ type: string; dimensions: { width: number; height: number } }

type BookStateInitState  = {
    selectedSize: SelectedBookType | null;
  }
  