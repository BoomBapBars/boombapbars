// app/page.tsx
import { Suspense } from "react";

/** Server entry — Suspense is required for useSearchParams in the client part */
export default function Page() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeClient />
    </Suspense>
  );
}

/** Lightweight fallback while the client part hydrates */
function HomeFallback() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10">
      <div className="h-7 w-64 rounded bg-gray-800 mb-3" />
      <div className="h-4 w-96 rounded bg-gray-800 mb-6" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl border border-gray-800 bg-gray-900 animate-shimmer" />
        ))}
      </div>
    </main>
  );
}
