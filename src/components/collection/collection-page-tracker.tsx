"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/integrations/analytics-client";

export function CollectionPageTracker() {
  useEffect(() => {
    trackEvent("page_view", {
      page_path: "/collections/birthstones",
      page_title: "Birthstone Collection",
    });
  }, []);

  return null;
}
