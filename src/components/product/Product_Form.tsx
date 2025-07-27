"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Product = {
  id?: number;
  title: string;
  price: number;
  category: string;
};

type ProductFormPropType = {
  product?: Product;
  isEdit?: boolean;
};

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.coerce.number().min(0.01, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
});

const ProductForm = ({ product, isEdit = false }: ProductFormPropType) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Product>();

  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: async (data: Product) => {
      const url = isEdit
        ? `https://dummyjson.com/products/${product?.id}`
        : "https://dummyjson.com/products/add";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["products"], (old: any) => {
        const products = old?.products || old || [];

        if (isEdit) {
          return {
            products: products.map((p: Product) =>
              p.id === data.id ? data : p,
            ),
          };
        }

        return { products: [...products, data] };
      });

      router.push("/products");
    },
  });

  const onSubmit = (data: Product) => {
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof Product;
        setError(field, { type: "manual", message: err.message });
      });
      return;
    }

    mutation.mutate(parsed.data);
  };

  return (
    <div className="flex h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg dark:bg-stone-900"
      >
        <h2 className="text-center text-2xl font-semibold text-stone-800 dark:text-white">
          {isEdit ? "Edit Item" : "Add Item"}
        </h2>

        <div>
          <input
            type="text"
            {...register("title")}
            placeholder="Title"
            className="w-full rounded-md border border-stone-300 bg-transparent px-4 py-3 text-sm text-stone-900 shadow-sm focus:border-blue-500 focus:ring focus:outline-none dark:border-stone-700 dark:text-white"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            placeholder="Price"
            className="w-full rounded-md border border-stone-300 bg-transparent px-4 py-3 text-sm text-stone-900 shadow-sm focus:border-blue-500 focus:ring focus:outline-none dark:border-stone-700 dark:text-white"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("category")}
            placeholder="Category"
            className="w-full rounded-md border border-stone-300 bg-transparent px-4 py-3 text-sm text-stone-900 shadow-sm focus:border-blue-500 focus:ring focus:outline-none dark:border-gray-700 dark:text-white"
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isEdit ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
