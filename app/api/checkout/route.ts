import { NextResponse } from "next/server";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const api    = `https://${domain}/api/2024-07/graphql.json`;

export async function POST(req: Request) {
  try {
    const { variantId, quantity = 1 } = await req.json();

    const query = /* GraphQL */ `
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { id checkoutUrl }
          userErrors { field message }
        }
      }
    `;

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { lines: [{ merchandiseId: variantId, quantity }] },
      }),
      cache: "no-store",
    });

    const json = await res.json();
    const err  = json.data?.cartCreate?.userErrors?.[0]?.message;
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
    return NextResponse.json({ checkoutUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Checkout failed." }, { status: 500 });
  }
}
