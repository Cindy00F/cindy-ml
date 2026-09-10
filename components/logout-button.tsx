"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/client-auth";

export function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground max-[700px]:min-h-9"
      onClick={() => {
        clearSession();
        router.push("/login");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
