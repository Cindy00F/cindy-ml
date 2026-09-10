"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/site";

export function ClientRedirect({ href }: { href: string }) {
  const target = withBase(href);

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <main className="grid min-h-svh place-items-center p-8 text-sm text-muted-foreground">
      <a href={target} className="underline underline-offset-4 hover:text-foreground">
        打开文章目录
      </a>
    </main>
  );
}
