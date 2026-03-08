import { create } from "zustand";

type PdfSubCategory = "organize" | "convert-from" | "convert-to" | "security" | null;

interface CategoryState {
  activeCategory: string;
  pdfSub: PdfSubCategory;
  setCategory: (category: string, pdfSub?: PdfSubCategory) => void;
  reset: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  activeCategory: "All Tools",
  pdfSub: null,
  setCategory: (category, pdfSub = null) => set({ activeCategory: category, pdfSub }),
  reset: () => set({ activeCategory: "All Tools", pdfSub: null }),
}));
