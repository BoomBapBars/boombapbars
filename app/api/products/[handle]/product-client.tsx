// app/products/[handle]/product-client.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Money = { amount: string; currencyCode: string };
type Variant = { id: string; title?: string; availableForSale?: boolean; price?: Money };
type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  images: { url: string; altText?: string | null }[];
  variants: Variant[];
  priceRange?: { minVariantPrice: Money };
};

async function createCheckout(variantId: string, quantity = 1) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines: [{ merchandiseId: variantId, quantity }] }),
  });
  if (!res.ok) throw new Error("Checkout failed");
  const json = await res.json();
  return json?.checkoutUrl as string;
}

function money(m?: Money) {
  if (!m) return "";
  const n = parseFloat(m.amount);
  if (Number.isNaN(n)) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: m.currencyCode || "USD" }).format(n);
}

export default function ProductClient({ product }: { product: Product }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = product.images?.length ? product.images : [{ url: "/og-image.png", altText: product.title }];

  const firstInStock = useMemo(
    () => product.variants?.find(v => v.availableForSale) ?? product.variants?.[0],
    [product.variants]
  );
  const price = firstInStock?.price ?? product.priceRange?.minVariantPrice;

  const [loading, setLoading] = useState(false);

  const buyNow = async () => {
    if (!firstInStock?.id) return;
    try {
      setLoading(true);
      const url = await createCheckout(firstInStock.id, 1);
      if (url) window.location.href = url;
    } catch {
      alert("Could not start checkout. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10">
      <div className="mb-6 text-sm">
        <Link href="/" className="text-white/70 hover:text-white">← Back to shop</Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <Image
              src={images[activeIdx]?.url}
              alt={images[activeIdx]?.altText || product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.url + i}
                  onClick={() => setActiveIdx(i)}
                  className="relative aspect-square overflow-hidden rounded-lg border border-gray-800"
                  data-active={i === activeIdx ? "true" : "false"}
                  aria-label={`Preview ${i + 1}`}
                >
                  <Image src={img.url} alt={img.altText || product.title} fill className="object-cover" sizes="20vw" />
                  <span
                    className="absolute inset-0 rounded-lg ring-2 ring-transparent"
                    style={{ boxShadow: i === activeIdx ? "0 0 0 2px var(--bbb-accent)" : "none" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          {price && <p className="mt-2 text-xl text-white/90">{money(price)}</p>}

          {product.variants?.length > 1 && (
            <p className="mt-1 text-sm text-white/60">
              {product.variants.filter(v => v.availableForSale).length} variant(s) available
            </p>
          )}

          <div className="mt-6 space-y-4 text-white/80 leading-relaxed">
            {product.description ? <p>{product.description}</p> : <p>No description yet.</p>}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={buyNow}
              disabled={!firstInStock?.availableForSale || loading}
              className="cta disabled:opacity-60"
            >
              {loading ? "Processing..." : firstInStock?.availableForSale ? "Buy Now" : "Sold Out"}
            </button>
            <a href="/" className="pill">Continue shopping</a>
          </div>
        </div>
      </div>
    </main>
  );
}
