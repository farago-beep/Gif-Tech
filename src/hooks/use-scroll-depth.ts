import { useEffect } from "react";
import { trackScrollDepth } from "@/lib/gtm";

const THRESHOLDS = [25, 50, 75, 100];

export const useScrollDepth = () => {
  useEffect(() => {
    const fired = new Set<number>();
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      THRESHOLDS.forEach((t) => {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackScrollDepth(t);
        }
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
};
