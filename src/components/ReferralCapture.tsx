"use client";

import { useEffect } from "react";

/**
 * Reads ?ref= from the URL and stashes it in localStorage (90 days) so the
 * checkout flow can attribute the order later.
 */
export function ReferralCapture() {
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && /^[A-Z0-9]{4,12}$/i.test(ref)) {
        localStorage.setItem("referralCode", ref);
        const exp = Date.now() + 90 * 24 * 60 * 60 * 1000;
        localStorage.setItem("referralCodeExp", String(exp));
      }
      const exp = Number(localStorage.getItem("referralCodeExp") ?? 0);
      if (exp && Date.now() > exp) {
        localStorage.removeItem("referralCode");
        localStorage.removeItem("referralCodeExp");
      }
    } catch {
      /* noop */
    }
  }, []);
  return null;
}
