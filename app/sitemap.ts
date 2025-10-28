export default async function sitemap() {
  const base = "https://boombapbars.com";
  return [
    { url: `${base}/`, priority: 1.0 },
    // later we’ll add /product/[handle] URLs when we build product pages
  ];
}
