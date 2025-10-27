export const dynamic = "force-dynamic"; // don't cache in Vercel/Next

import { NextResponse } from "next/server";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const api    = `https://${domain}/api/2024-07/graphql.json`;

export async function GET() {
  try {
    const query = /* GraphQL */ `
      query DebugProducts {
        products(first: 5, sortKey: CREATED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            featuredImage { url altText }
            images(first: 1) { edges { node { url altText } } }
            variants(first: 1) { nodes { id title } }
          }
        }
      }
    `;

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const json = await res.json();

    // Compact, useful diagnostics without leaking secrets
    const diagnostics = {
      ok: res.ok,
      status: res.status,
      domain,
      tokenPresent: Boolean(token && token.length > 10),
      errors: json.errors ?? null,
      count: json.data?.products?.nodes?.length ?? 0,
      sample: (json.data?.products?.nodes ?? []).map((p: any) => ({
        title: p.title,
        handle: p.handle,
        variantId: p.variants?.nodes?.[0]?.id ?? null,
        image:
          p.featuredImage?.url ??
          p.images?.edges?.[0]?.node?.url ??
          null,
      })),
    };

    return NextResponse.json(diagnostics, { status: res.ok ? 200 : 502 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
