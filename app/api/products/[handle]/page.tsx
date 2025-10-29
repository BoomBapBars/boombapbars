// app/products/[handle]/page.tsx
import ProductClient from "./product-client";

export const revalidate = 0;

async function getProduct(handle: string) {
  // Try absolute URL first if NEXT_PUBLIC_SITE_URL is set
  const abs = process.env.NEXT_PUBLIC_SITE_URL
    ? await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/product/${handle}`, { cache: "no-store" }).catch(() => null)
    : null;

  if (abs && abs.ok) return abs.json();

  // Fallback to relative (works locally and on Vercel)
  const rel = await fetch(`/api/product/${handle}`, { cache: "no-store" }).catch(() => null);
  if (rel && rel.ok) return rel.json();

  return { product: null };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { product } = await getProduct(params.handle);
  if (!product) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-14">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-white/70">Try returning to the homepage and selecting a different item.</p>
      </main>
    );
  }
  return <ProductClient product={product} />;
}
