"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Instagram, Music2, Sparkles, BadgePercent, Mail, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { hasShopify, shopify } from "@/lib/shopify";



export default function BoomBapBarsHome() {
  const [email, setEmail] = useState("");
const [items, setItems] = useState<any[]>([]);

useEffect(() => {
  (async () => {
    try {
      // simple probe: ask Shopify for a few products
      const query = `
        { products(first: 6) {
            nodes {
              id
              title
              featuredImage { url }
              variants(first:1){ nodes { id price { amount currencyCode } } }
              tags
            }
        }}`
      const res: any = await shopify(query);
      const fromShopify = res?.data?.products?.nodes?.map((p: any) => {
        const v = p.variants?.nodes?.[0];
        return {
          title: p.title,
          price: v?.price ? new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: v.price.currencyCode
          }).format(parseFloat(v.price.amount)) : "",
          img: p.featuredImage?.url ?? "/house.jpg",
          tag: p.tags?.[0] ?? "Featured",
          variantId: v?.id,
        };
      }) ?? [];
      setItems(fromShopify);
    } catch (e) {
      console.error("Shopify fetch failed", e);
      setItems([]); // keep empty; we’ll fall back to your static list below
    }
  })();
}, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />, 
      title: "Golden Age Vibes",
      body: "90s–2000s hip-hop energy — raw drums, gritty textures, and bold type."
    },
    {
      icon: <BadgePercent className="w-6 h-6" />, 
      title: "Weekly Drops",
      body: "New Drop Fridays. Limited runs. Collect them like 12\" singles."
    },
    {
      icon: <Music2 className="w-6 h-6" />, 
      title: "DJ Approved",
      body: "Designs that nod to turntablism, battles, and crate-digging culture."
    }
  ];

  const products = [
    {
      title: "Boom Bap Nutrition Facts Tee",
      price: "$32",
      img: "https://i.etsystatic.com/61509595/r/il/8efe93/7317631034/il_600x600.7317631034_ggo0.jpg",
      tag: "Facts go BOOM"
    },
    {
      title: "Turntablist Label Tee",
      price: "$32",
      img: "https://i.etsystatic.com/61509595/r/il/be620f/7317678326/il_600x600.7317678326_poeq.jpg",
      tag: "Scratch Science"
    },
    {
      title: "House Music Facts Tee",
      price: "$32",
      img: "/house.jpg",
      tag: "Deep Cut"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="fixed top-2 right-2 text-xs text-neutral-400">Mode: {hasShopify ? 'Shopify' : 'Mock'}</div>
<div className="fixed top-6 right-2 text-xs text-neutral-400">Items: {items.length}</div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
          <img 
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop" 
            alt="Urban backdrop"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs sm:text-sm bg-black/40 border-white/15">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              New Drop Friday • Live now
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
              BoomBapBars
            </h1>
            <p className="max-w-2xl text-neutral-300 text-base sm:text-lg">
              Golden Age lyrics reimagined. Streetwear for DJs, crate-diggers, and anyone who still loves a filthy snare.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="rounded-2xl">
                <ShoppingBag className="mr-2 h-4 w-4" /> Shop the Drop
              </Button>
              <Button size="lg" variant="secondary" className="rounded-2xl border border-white/20 bg-white/10">
                <Play className="mr-2 h-4 w-4" /> Watch Lookbook
              </Button>
            </div>

            <div className="text-xs sm:text-sm text-neutral-400 flex items-center gap-2">
              <span className="uppercase tracking-widest">The Real Alternative Facts</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="bg-neutral-900/60 border-neutral-800">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800">{f.icon}</div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-neutral-300 text-sm">{f.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured</h2>
            <Button variant="ghost" className="text-neutral-300">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(items.length ? items : products).map((p, i) => (

              <Card key={i} className="group bg-neutral-900/60 border-neutral-800 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <CardHeader>
                  <div className="text-xs text-neutral-400 uppercase tracking-widest">{p.tag}</div>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-neutral-200">{p.price}</span>
                  <Button
  size="sm"
  className="rounded-xl"
  onClick={() =>
    p.variantId
      ? shopify(`
          mutation($lines:[CartLineInput!]) {
            cartCreate(input:{ lines:$lines }) {
              cart { checkoutUrl }
              userErrors { message }
            }
          }
        `, { lines: [{ merchandiseId: p.variantId, quantity: 1 }] }
      ).then((res:any) => {
        const url = res?.data?.cartCreate?.cart?.checkoutUrl;
        if (url) window.location.href = url;
        else alert("Could not create checkout.");
      })
      : alert("No variant for this item (fallback only).")
  }
>
  Add to cart
</Button>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-neutral-400">© {new Date().getFullYear()} BoomBapBars</div>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://boombapbars.com" className="hover:underline">boombapbars.com</a>
            <a href="#" className="inline-flex items-center gap-1 hover:underline">
              <Instagram className="w-4 h-4" /> @BoomBapBars
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
