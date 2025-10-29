// app/api/products/route.ts
import { NextResponse } from "next/server";
export const revalidate = 0;

function getEnv(name: string) {
  return process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`] ?? null;
}

const DOMAIN = getEnv("SHOPIFY_STORE_DOMAIN");
const TOKEN  = getEnv("SHOPIFY_STOREFRONT_TOKEN");

// Compatible query (no priceRangeV2) + productType
const QUERY = /* GraphQL */ `
  query ProductsForHome {
    products(first: 30, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          tags
          images(first: 1) { edges { node { url altText } } }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(req: Request) {
  if (!DOMAIN || !TOKEN) {
    return NextResponse.json(
      { error: "Missing SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN" },
      { status: 500 }
    );
  }

  const debug = new URL(req.url).searchParams.get("debug") === "1";
  const endpoint = `https://${DOMAIN}/api/2024-07/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN!,
      },
      body: JSON.stringify({ query: QUERY }),
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok || json.errors) {
      return NextResponse.json(
        debug ? { status: res.status, errors: json.errors ?? json } : { error: "Shopify API error" },
        { status: 502 }
      );
    }

    const edges = json?.data?.products?.edges ?? [];
    const products = edges.map((e: any) => {
      const n = e.node;
      const img = n.images?.edges?.[0]?.node ?? null;
      const vEdge = n.variants?.edges?.[0]?.node;

      const minVariantPrice =
        n.priceRange?.minVariantPrice ??
        (vEdge?.price ? { amount: vEdge.price.amount, currencyCode: vEdge.price.currencyCode } : null);

      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        description: n.description,
        productType: n.productType ?? "",
        tags: n.tags ?? [],
        image: img ? { url: img.url, altText: img.altText ?? null } : null,
        priceRange: { minVariantPrice },
        variant: vEdge
          ? { id: vEdge.id, availableForSale: !!vEdge.availableForSale }
          : null,
      };
    });

    return debug ? NextResponse.json({ raw: json.data, products }) : NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Network error" }, { status: 500 });
  }
}
