// app/api/diag/route.ts
import { NextResponse } from "next/server";

function getEnv(name: string) {
  return process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`] ?? null;
}

const DOMAIN = getEnv("SHOPIFY_STORE_DOMAIN");
const TOKEN = getEnv("SHOPIFY_STOREFRONT_TOKEN");

export const revalidate = 0;

export async function GET() {
  const report: any = {
    env: {
      SHOPIFY_STORE_DOMAIN: !!DOMAIN,
      SHOPIFY_STOREFRONT_TOKEN: !!TOKEN,
    },
    request: null as any,
    responseStatus: null as any,
    errors: null as any,
  };

  if (!DOMAIN || !TOKEN) {
    report.errors = "Missing env vars";
    return NextResponse.json(report, { status: 500 });
  }

  const endpoint = `https://${DOMAIN}/api/2024-07/graphql.json`;
  const QUERY = /* GraphQL */ `
    {
      shop { name }
      products(first: 1, sortKey: UPDATED_AT, reverse: true) {
        edges { node { id title handle } }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query: QUERY }),
      cache: "no-store",
    });
    report.responseStatus = `${res.status} ${res.statusText}`;
    const json = await res.json();
    report.request = { endpoint, query: "shop + 1 product" };
    if (!res.ok || json.errors) {
      report.errors = json.errors ?? json;
      return NextResponse.json(report, { status: 502 });
    }
    return NextResponse.json({ ...report, data: json.data });
  } catch (e: any) {
    report.errors = e?.message ?? "network error";
    return NextResponse.json(report, { status: 500 });
  }
}
