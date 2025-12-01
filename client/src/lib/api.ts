import type { Product } from "@/types";
import { buildApiUrl } from "./config/env";

async function getJson<T>(path: string, options?: RequestInit): Promise<T> {
  const targetUrl = buildApiUrl(path);
  const res = await fetch(targetUrl, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json() as Promise<T>;
}

export function fetchProducts(): Promise<{ products: Product[] }> {
  return getJson<{ products: Product[] }>("/api/products");
}

export function fetchProduct(id: string): Promise<Product> {
  return getJson<Product>(`/api/products/${id}`);
}

export function fetchProductBySlug(slug: string): Promise<Product> {
  return getJson<Product>(`/api/products/slug/${slug}`);
}
