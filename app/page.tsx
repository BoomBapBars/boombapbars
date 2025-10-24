"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Instagram, Music2, Sparkles, BadgePercent, Mail, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function BoomBapBarsHome() {
  const [email, setEmail] = useState("");

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
      img: "https://images.unsplash.com/photo-1520975682031-d287ae535c46?q=80&w=1200&auto=format&fit=crop",
      tag: "Alt Facts Edition"
    },
    {
      title: "Turntablist Label Tee",
      price: "$34",
      img: "https://images.unsplash.com/photo-1490092374320-1ca36d69ff17?q=80&w=1200&auto=format&fit=crop",
      tag: "Scratch Science"
    },
    {
      title: "House Music Facts Tee",
      price: "$32",
      img: "https://images.unsplash.com/photo-1520975980146-c3d2a9c59478?q=80&w=1200&auto=format&fit=crop",
      tag: "Deep Cut"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
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
            {products.map((p, i) => (
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
                  <Button size="sm" className="rounded-xl">Add to cart</Button>
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
