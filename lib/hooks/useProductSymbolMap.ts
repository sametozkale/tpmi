"use client";

import {
  DEFAULT_PRODUCT_SYMBOL_MAP,
  type ProductSymbolMap,
} from "@/lib/metals-symbols";
import { useEffect, useState } from "react";

let symbolMapCache: ProductSymbolMap | null = null;
let symbolMapRequest: Promise<ProductSymbolMap> | null = null;

async function loadProductSymbolMap(): Promise<ProductSymbolMap> {
  if (symbolMapCache) return symbolMapCache;
  if (symbolMapRequest) return symbolMapRequest;

  symbolMapRequest = fetch("/api/metals/symbols")
    .then((r) => r.json())
    .then((j: { symbols?: ProductSymbolMap } | null) => {
      symbolMapCache = j?.symbols ?? DEFAULT_PRODUCT_SYMBOL_MAP;
      return symbolMapCache;
    })
    .catch(() => DEFAULT_PRODUCT_SYMBOL_MAP)
    .finally(() => {
      symbolMapRequest = null;
    });

  return symbolMapRequest;
}

export function useProductSymbolMap() {
  const [symbolMap, setSymbolMap] = useState<ProductSymbolMap>(
    symbolMapCache ?? DEFAULT_PRODUCT_SYMBOL_MAP,
  );

  useEffect(() => {
    let mounted = true;
    void loadProductSymbolMap().then((map) => {
      if (!mounted) return;
      setSymbolMap(map);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return symbolMap;
}
