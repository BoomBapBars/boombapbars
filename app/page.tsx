'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// ---------- Types ----------
type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ShopifyVariant = {
  id: string;
  title?: string;
  price?: string | number;
  availableForSale?: boolean;
};

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  tags?: string[];
  images?: ShopifyImage[];
  variants?: ShopifyVariant[];
};

// ---------- Helpers ----------
async function createCheckout(variantId: string, quantity = 1) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines: [{ merchandiseId: variantId, quantity }] }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Checkout failed');
  }
  const data = await res.json();
  return data?.checkoutUrl as string;
}

function currencyFormat(value?: string | number, currency = 'USD') {
  if (value == null) return '';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
}

// ---------- Motion Variants (typed) ----------
const pageVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.08 } },
} satisfies Variants;

const heroVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 220, damping: 24 },
  },
} satisfies Variants;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
} satisfies Variants;

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 26 },
  },
} satisfies Variants;

// ---------- Skeleton ----------
function CardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute inset-0 bg-neutral-800/80 animate-shimmer" />
      </div>
      <div className="p-4">
        <div className="h-5 w-2/3 rounded bg-neutral-800 animate-shimmer" />
        <div className="mt-2 h-4 w-1/3 rounded bg-neutral-800 animate-shimmer" />
      </div>
    </div>
  );
}

// ---------- Product Card ----------
function ProductCard({ product }: { product: ShopifyProduct }) {
  const img = product.images?.[0];
  const variant = product.variants?.[0];
  const price = variant?.price;
  const available = variant?.availableForSale ?? true;

  const [busy, setBusy] = useState(false);

  const onBuyNow = async () => {
    if (!variant?.id) return;
    try {
      setBusy(true);
      const url = await createCheckout(variant.id, 1);
      if (url) window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Could not start checkout. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {img?.url ? (
          <Image
            src={img.url}
            alt={img.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-neutral-800 text-neutral-400">
            No image
          </div>
        )}

        {/* Subtle reflection */}
        <div className="pointer-events-none card-reflection" />

        {/* Sweep shine on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="shine-sweep" />
        </div>

        {/* Quick actions */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={`/products/${product.handle}`}
            className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-center text-sm font-medium text-white backdrop-blur hover:bg-white/15"
          >
            View
          </Link>
          <button
            onClick={onBuyNow}
            disabled={!available || busy}
            className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-center text-sm font-semibold text-emerald-900 hover:bg-emerald-400 disabled:opacity-50"
            aria-disabled={!available || busy}
          >
            {busy ? 'Loading…' : available ? 'Buy Now' : 'Sold Out'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-balance text-base font-semibold text-white">
            {product.title}
          </h3>
          <span className="shrink-0 text-sm text-neutral-300">{currencyFormat(price)}</span>
        </div>
        {product.tags && product.tags.length > 0 && (
          <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
            {product.tags.slice(0, 3).join(' · ')}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ---------- Category Tabs ----------
function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="relative mb-6 flex w-full flex-wrap gap-2">
      {categories.map((c) => {
        const activeTab = c === active;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="relative rounded-full px-4 py-2 text-sm font-medium text-neutral-200 hover:text-white"
            data-active={activeTab ? 'true' : 'false'}
          >
            {c}
            <span className="tab-underline" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

// ---------- Background FX ----------
function BackgroundFX() {
  return (
    <>
      {/* Soft radial vignette */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(1000px_500px_at_100%_10%,rgba(16,185,129,0.08),transparent_60%)]" />
      {/* Animated gradient wash */}
      <div className="pointer-events-none fixed inset-0 -z-10 animate-gradient-rotate bg-conic" />
      {/* Film grain */}
      <div className="pointer-events-none fixed inset-0 -z-10 grain opacity-[0.08] mix-blend-overlay" />
    </>
  );
}

// ---------- Page ----------
export default function Page() {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (!alive) return;
        const items: ShopifyProduct[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : [];
        setProducts(items);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    (products || []).forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (category === 'All') return products;
    return products.filter((p) => (p.tags || []).includes(category));
  }, [products, category]);

  return (
    <>
      <BackgroundFX />
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10"
      >
        {/* Hero */}
        <section className="mb-8">
          <motion.h1
            variants={heroVariants}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            BoomBapBars — New Drop Fridays
          </motion.h1>

          <motion.p
            variants={heroVariants}
            className="mt-2 max-w-2xl text-sm text-neutral-300 sm:text-base"
          >
            Truth in threads. Animated grids. Checkout that actually checks out.
          </motion.p>

          {/* Animated underline */}
          <motion.div
            variants={heroVariants}
            className="relative mt-4 h-[3px] w-40 overflow-hidden rounded-full bg-neutral-800"
          >
            <span className="hero-underline" />
          </motion.div>
        </section>

        {/* Category Tabs */}
        <CategoryTabs categories={categories} active={category} onChange={setCategory} />

        {/* Grid */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.section
            key={category}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={`s-${i}`} />)}

            {!loading && filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-neutral-800 p-10 text-center text-neutral-300">
                Nothing here yet — try another tag.
              </div>
            )}

            {!loading && filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.section>
        </AnimatePresence>
      </motion.main>
    </>
  );
}
