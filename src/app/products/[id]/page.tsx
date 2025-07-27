type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  const product = await res.json();

  return {
    title: `${product.title} – MyShop`,
  };
}

export default async function ProductPage({ params }: Props) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  const product = await res.json();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[350px] space-y-4 rounded-2xl bg-white p-6 text-center text-zinc-900 shadow-lg dark:bg-zinc-900 dark:text-zinc-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="mx-auto h-64 w-64 rounded-md object-cover"
        />
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          ₹{product.price}
        </p>
        <p className="dark:text-zinc-400">{product.description}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Brand: {product.brand}
        </p>
      </div>
    </div>
  );
}
