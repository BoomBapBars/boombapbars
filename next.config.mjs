// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "shopifycdn.net" },
      // some stores serve through Shopify’s new asset hostnames too:
      { protocol: "https", hostname: "imagecdn.app" }, // optional, future-proof
      { protocol: "https", hostname: "shops.myshopify.com" }, // optional, if used
    ],
  },
};

export default nextConfig;
