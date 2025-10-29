// components/SiteHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/" },  // later: /collections/all or /shop
  { name: "About", href: "/about" }, // placeholder
];

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b border-bbb-800/70 backdrop-blur-sm supports-[backdrop-filter]:bg-black/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="BoomBapBars" width={28} height={28} />
          <span className="font-display text-2xl">BoomBapBars</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link relative"
                data-active={active ? "true" : "false"}
              >
                {item.name}
                {active && <span className="tab-underline absolute left-1/2 -translate-x-1/2 w-8" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#shop" className="cta">Shop Now</a>
        </div>
      </div>
    </header>
  );
}
