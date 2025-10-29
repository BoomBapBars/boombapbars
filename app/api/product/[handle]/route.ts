// app/api/product/[handle]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// keep env lookups simple (supports NEXT_PUBLIC_ fallback)
function getEnv(name: string) {
  return process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`] ?? null;
}
const DOMAIN = getEnv("SHOPIFY_STORE_DOMAIN");
const TOKEN  = getEnv("SHOPIFY_STOREFRONT_TOKEN");

export const dynamic = "force-dynamic";
export const revalidate = 0;

const QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      productType
      tags
      images(first: 8) { edges { node { url altText } } }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 20) {
        edges { node { id title availableForSale price { amount currencyCode } } }
      }
    }
  }
`;

/**
 * NOTE:
 * Next 16’s route type sometimes mis-infers `params` as a Promise when you
 * destructure in the signature. Using a rest arg keeps the function type
 * compatible with RouteHandler while still giving us access to params.
 */
export async function GET(_req: NextRequest, ...rest: any[]) {
  try {
    if (!DOMAIN || !TOKEN) {
      return NextResponse.json(
        { error: "Missing SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN" },
        { status: 500 }
      );
    }

    const ctx = (rest?.[0] ?? {}) as { params?: { handle?: string } };
    const handle = ctx?.params?.handle;
    if (!handle) {
      return NextResponse.json({ error: "Missing product handle" }, { status: 400 });
    }

    const endpoint = `https://${DOMAIN}/api/2024-07/graphql.json`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN!,
      },
      body: JSON.stringify({ query: QUERY, variables: { handle } }),
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok || json.errors) {
      return NextResponse.json(
        { error: json.errors ?? "Shopify error" },
        { status: 502 }
      );
    }

    const p = json?.data?.product;
    if (!p) return NextResponse.json({ product: null });

    const images = (p.images?.edges ?? []).map((e: any) => e.node);
    const variants = (p.variants?.edges ?? []).map((e: any) => e.node);

    return NextResponse.json({
      product: {
        id: p.id,
        title: p.title,
        handle,
        description: p.description,
        productType: p.productType ?? "",
        tags: p.tags ?? [],
        images,
        priceRange: p.priceRange ?? null,
        variants,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Network error" }, { status: 500 });
  }
}
