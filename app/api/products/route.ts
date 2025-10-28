// app/api/products/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

const QUERY = `
  query ProductsQuery($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          tags
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price: priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json(
        {
          error: "Missing Shopify env vars",
          details: [
            "SHOPIFY_STORE_DOMAIN",
            "SHOPIFY_STOREFRONT_TOKEN",
          ],
        },
        { status: 500 }
      );
    }

    const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { first: 50 },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Shopify ${res.status}`, details: text },
        { status: 502 }
      );
    }

    const json = await res.json();
    const products = (json?.data?.products?.edges ?? []).map((e: any) => {
      const n = e.node;
      const img = n?.images?.edges?.[0]?.node;
      const v = n?.variants?.edges?.[0]?.node;

      return {
        id: n.id,
        title: n.title,
        handle: n.handle,
        tags: n.tags ?? [],
        images: img ? [img] : [],
        variants: v
          ? [
              {
                id: v.id,
                title: v.title,
                availableForSale: v.availableForSale,
                price: v.price?.amount,
              },
            ]
          : [],
      };
    });

    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Unhandled /api/products failure",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
