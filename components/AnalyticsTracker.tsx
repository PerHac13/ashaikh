"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordAnalyticsEvent } from "@/actions/trackingActions";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double tracking same path on rapid renders
    if (pathname && pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;

      // Determine simple device category
      let deviceType = "Desktop";
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        deviceType = "Mobile";
      } else if (typeof window !== "undefined" && window.innerWidth < 1024) {
        deviceType = "Tablet";
      }

      const referrer = typeof document !== "undefined" ? document.referrer : "";

      // Fire non-blocking beacon
      recordAnalyticsEvent({
        path: pathname,
        eventType: "page_view",
        referrer: referrer.slice(0, 300),
        deviceType,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
