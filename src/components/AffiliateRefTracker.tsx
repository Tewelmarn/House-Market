"use client";
import { useEffect } from "react";
import { getRefFromUrl, storeRef } from "@/lib/affiliate";

export default function AffiliateRefTracker() {
  useEffect(() => {
    const ref = getRefFromUrl();
    if (ref) storeRef(ref);
  }, []);
  return null;
}
