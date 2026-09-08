"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const { session, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(session ? "/dashboard" : "/login");
  }, [ready, session, router]);

  return (
    <div className="flex min-h-svh items-center justify-center text-muted-foreground">
      …
    </div>
  );
}
