"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || last.current === pathname) return;
    last.current = pathname;
    track({ name: "page_view", path: pathname });
    const match = pathname.match(/\/articles\/([^/]+)/);
    if (match?.[1]) track({ name: "article_open", slug: match[1] });
  }, [pathname]);

  return null;
}
