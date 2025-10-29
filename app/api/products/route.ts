// app/api/products/route.ts
import { NextResponse } from "next/server";

export const revalidate = 0; // keep fresh during setup

function getEnv(name: string) {
  return (
    process.env[name] ??
    process.env[`NEXT_PUBLIC_${name}`] ?? // allow public names as fallback
    null
  );
}

const DOMAIN = getEnv("SHOPIFY_STORE_DOMAIN");
const TOKEN = getEnv("SHOPIFY_STOREFRONT_TOKEN");

// Minimal product listing query
const QUERY = /* GraphQL */ `
  query ProductsForHome {
    products(first: 24, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  if (!DOMAIN || !TOKEN) {
    return NextResponse.json(
      {
        error:
          "Missing Shopify env vars. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN (or their NEXT_PUBLIC_* equivalents).",
      },
      { status: 500 }
    );
  }

  const endpoint = `https://${DOMAIN}/api/2024-07/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query: QUERY }),
      // Avoid caching during setup
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Shopify API ${res.status}: ${text.slice(0, 500)}` },
        { status: 502 }
      );
    }

    const json = await res.json();

    // Normalize to a compact array
    const edges = json?.data?.products?.edges ?? [];
    const products = edges.map((e: any) => {
      const n = e.node;
      const image = n.images?.edges?.[0]?.node ?? null;
      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        description: n.description,
        tags: n.tags ?? [],
        priceRange: {
          minVariantPrice: n.priceRangeV2?.minVariantPrice ?? null,
        },
        image: image
          ? { url: image.url, altText: image.altText ?? null }
          : null,
      };
    });

    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Request failed: ${err?.message ?? "unknown error"}` },
      { status: 500 }
    );
  }
}
