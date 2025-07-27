"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import ProductForm from "@/components/product/Product_Form";

export default function EditProductById() {
  const { selectedProduct } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    if (!selectedProduct) {
      router.push("/products"); 
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  return <ProductForm product={selectedProduct} isEdit />;
}
