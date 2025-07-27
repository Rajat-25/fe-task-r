import { create } from "zustand";

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  category:string;
  thumbnail: string;
};

type ProductStore = {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
