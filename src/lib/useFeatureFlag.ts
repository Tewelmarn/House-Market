"use client";
import { useEffect, useState } from "react";

const cache: Record<string, boolean> = {};

export function useFeatureFlag(name: string): boolean {
  const [enabled, setEnabled] = useState(cache[name] ?? false);

  useEffect(() => {
    if (cache[name] !== undefined) { setEnabled(cache[name]); return; }
    fetch("/api/admin/feature-flags")
      .then((r) => r.json())
      .then((flags: { name: string; enabled: boolean }[]) => {
        flags.forEach((f) => { cache[f.name] = f.enabled; });
        setEnabled(cache[name] ?? false);
      })
      .catch(() => {});
  }, [name]);

  return enabled;
}
