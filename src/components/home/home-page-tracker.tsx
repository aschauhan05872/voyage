"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/integrations/analytics-client";

type HomePageTrackerProps = {
  path: string;
};

export function HomePageTracker({ path }: HomePageTrackerProps) {
  useEffect(() => {
    trackEvent("page_view", { page_path: path, page_title: "Homepage" });
  }, [path]);

  return null;
}
