import type { Product } from "@/types";

async function getJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
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
