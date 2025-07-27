"use client";
import { DataTable } from "@/components/table/data-table";
import Skeleton from "@/components/ui/skeleton";
import { useProductStore } from "@/store/productStore";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <span
          onClick={() => router.push(`/products/${row.original.id}`)}
          className="cursor-pointer text-blue-600 "
        >
          {row.original.title}
        </span>
      );
    },
    enableSorting: true,
  },

  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    cell: ({ row }) => `₹${row.original.price}`,
  },

  {
    accessorKey: "rating",
    header: "Rating",
    enableSorting: true,
  },
  {
    accessorKey: "thumbnail",
    header: "Image",
    enableSorting: false,

    cell: ({ row }) => (
      <img
        src={row.original.thumbnail}
        alt="product"
        className="h-10 w-10 rounded object-cover"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      const queryClient = useQueryClient();
      const deleteProduct = async (id: number) => {
        const res = await fetch(`https://dummyjson.com/products/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete product");
        return res.json();
      };

      const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: (_, id) => {
          queryClient.setQueryData(["products"], (old: any) => ({
            ...old,
            products: old.products.filter((product: any) => product.id !== id),
          }));
        },
      });

      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              useProductStore.getState().setSelectedProduct(row.original);
              router.push(`/products/edit/${row.original.id}`);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => deleteMutation.mutate(row.original.id)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      );
    },
  },
];

const fetchUsers = async () => {
  const res = await fetch("https://dummyjson.com/products");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const Products = () => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <Skeleton />;
  }
  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        Error: {error.message}
      </div>
    );
  if (data) {
    return (
      <div className="h-screen overflow-y-auto px-4 pt-1 sm:px-6">
        <DataTable columns={columns} data={data.products} />
      </div>
    );
  }
};

export default Products;
