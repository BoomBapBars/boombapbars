// app/HomeClient.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// ---------- Types ----------
type ShopifyImage = { url: string; altText?: string | null; width?: number | null; height?: number | null; };
type ShopifyVariant = { id: string; title?: string; price?: string | number; availableForSale?: boolean; };
type ShopifyProduct = { id: string; title: string; handle: string; tags?: string[]; images?: ShopifyImage[]; variants?: ShopifyVariant[]; };

// ---------- Helpers ----------
async function createCheckout(variantId: string, quantity = 1) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines: [{ merchandiseId: variantId, quantity }] }),
  });
  if (!res.ok) throw new Error(`Checkout failed (${res.status})`);
  const data = await res.json();
  return data?.checkoutUrl as string;
}
function currencyFormat(value?: string | number, currency = 'USD') {
  if (value == null) return '';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
}

// ---------- Motion Variants ----------
const pageVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.08 } } } satisfies Variants;
const heroVariants = { hidden: { opacity: 0, y: 14, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 220, damping: 24 } } } satisfies Variants;
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } } } satisfies Variants;
const cardVariants = { hidden: { opacity: 0, y: 14, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 26 } } } satisfies Variants;

// ---------- UI bits ----------
function CardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-800/80 animate-shimmer" />
      </div>
      <div className="p-4">
        <div className="h-5 w-2/3 rounded bg-gray-800 animate-shimmer" />
        <div className="mt-2 h-4 w-1/3 rounded bg-gray-800 animate-shimmer" />
      </div>
    </div>
  );
}
function ErrorBanner({ message }: { message: string }) {
  return <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{message}</div>;
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
    try { setBusy(true); const url = await createCheckout(variant.id, 1); if (url) window.location.href = url; }
    catch { alert('Could not start checkout. Try again in a moment.'); }
    finally { setBusy(false); }
  };

  return (
    <motion.div variants={cardVariants} className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        {img?.url ? (
          <Image src={img.url} alt={img.altText || product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gray-800 text-gray-400">No image</div>
        )}
        <div className="pointer-events-none card-reflection" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="shine-sweep" />
        </div>
        <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link href={`/products/${product.handle}`} className="flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium text-white bg-white bg-opacity-10 hover:bg-opacity-20">View</Link>
          <button onClick={onBuyNow} disabled={!available || busy} className="flex-1 rounded-xl px-3 py-2 text-center text-sm font-semibold text-green-900 bg-green-500 hover:bg-green-400 disabled:opacity-50" aria-disabled={!available || busy}>
            {busy ? 'Loading…' : available ? 'Buy Now' : 'Sold Out'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-balance text-base font-semibold text-white">{product.title}</h3>
          <span className="shrink-0 text-sm text-gray-300">{currencyFormat(price)}</span>
        </div>
        {product.tags && product.tags.length > 0 && (
          <p className="mt-1 line-clamp-1 text-xs text-gray-400">{product.tags.slice(0, 3).join(' · ')}</p>
        )}
      </div>
    </motion.div>
  );
}

// ---------- Sticky Category Tabs ----------
function CategoryTabs({ categories, active, onChange }: { categories: string[]; active: string; onChange: (c: string) => void; }) {
  return (
    <div className="sticky top-0 z-40 -mx-4 mb-6 border-b border-gray-900/70 bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex w-full flex-wrap gap-2 py-3">
          {categories.map((c) => {
            const activeTab = c === active;
            return (
              <button key={c} onClick={() => onChange(c)} className="relative rounded-full px-4 py-2 text-sm font-medium text-gray-200 hover:text-white" data-active={activeTab ? 'true' : 'false'}>
                {c}
                <span className="tab-underline" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Micro-Parallax Background ----------
function BackgroundFX() {
  const [y, setY] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => { setY(window.scrollY || 0); if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; });
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => { window.removeEventListener('scroll', onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);
  const g = (f: number) => ({ transform: `translate3d(0, ${-(y * f)}px, 0)` });
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-30" style={{ background: 'radial-gradient(1200px 600px at 50% -10%, rgba(99,102,241,0.10), transparent 60%), radial-gradient(1000px 500px at 100% 10%, rgba(34,197,94,0.06), transparent 60%)' }} />
      <div className="pointer-events-none fixed inset-0 -z-40 bg-conic" style={g(0.04)} aria-hidden />
      <div className="pointer-events-none fixed inset-0 -z-50 grain opacity-[0.08] mix-blend-overlay" style={g(0.02)} aria-hidden />
    </>
  );
}

// ---------- Client Page ----------
export default function HomeClient() {
  const router = useRouter();
  const search = useSearchParams();

  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const initialTag = (search.get('tag') || 'All').trim();
  const [category, setCategory] = useState<string>(initialTag || 'All');

  useEffect(() => {
    const params = new URLSearchParams(Array.from(search.entries()));
    if (category === 'All') params.delete('tag'); else params.set('tag', category);
    router.replace(`/?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(null); setLoading(true);
        const res = await fetch('/api/products?ts=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) throw new Error(`GET /api/products → ${res.status} ${res.statusText}`);
        const data = await res.json();
        const items: any[] =
          Array.isArray(data) ? data :
          Array.isArray((data as any)?.products) ? (data as any).products :
          Array.isArray((data as any)?.data?.products) ? (data as any).data.products :
          [];
        const normalized: ShopifyProduct[] = items.map((p) => ({
          id: p.id, title: p.title, handle: p.handle,
          tags: p.tags ?? [], images: p.images ?? (p.image ? [p.image] : []), variants: p.variants ?? [],
        }));
        if (!alive) return;
        setProducts(normalized);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || 'Failed to load products.');
        setProducts([]);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(); set.add('All');
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
      <motion.main variants={pageVariants} initial="hidden" animate="show" className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10">
        <section className="mb-6">
          <motion.h1 variants={heroVariants} className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">BoomBapBars — New Drop Fridays</motion.h1>
          <motion.p variants={heroVariants} className="mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">Truth in threads. Animated grids. Checkout that actually checks out.</motion.p>
          <motion.div variants={heroVariants} className="relative mt-4 h-[3px] w-40 overflow-hidden rounded-full bg-gray-800"><span className="hero-underline" /></motion.div>
        </section>

        {err && <ErrorBanner message={err} />}

        <CategoryTabs categories={categories} active={category} onChange={setCategory} />

        <AnimatePresence initial={false} mode="popLayout">
          <motion.section key={category} variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading && Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={`s-${i}`} />)}
            {!loading && !err && filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-gray-800 p-10 text-center text-gray-300">Nothing here yet — try another tag.</div>
            )}
            {!loading && filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.section>
        </AnimatePresence>
      </motion.main>
    </>
  );
}
