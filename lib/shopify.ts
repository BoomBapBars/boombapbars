// lib/shopify.ts
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

export const hasShopify = Boolean(domain && token);

export async function shopify<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  if (!hasShopify) throw new Error("Shopify env missing");

  const url = `https://${domain}/api/2024-10/graphql.json`;
  console.log("[Shopify] POST", url, { hasToken: Boolean(token), vars: variables });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const text = await res.text();
  console.log("[Shopify] status", res.status, "body:", text.slice(0, 500)); // first 500 chars

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("[Shopify] JSON parse error", e);
    throw e;
  }
}

