// components/SiteFooter.tsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-bbb-800/70">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/70">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} BoomBapBars — All vibes reserved.</p>
          <p>
            Built with Shopify + Next.js. New Drop Fridays.
          </p>
        </div>
      </div>
    </footer>
  );
}
