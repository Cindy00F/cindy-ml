"use client";

import { Check } from "lucide-react";
import { useSyncExternalStore } from "react";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import {
  emptyProgress,
  loadProgress,
  markCompleted,
  subscribeProgress,
} from "@/lib/progress";
import { cn } from "@/lib/utils";

export function MarkReadButton({
  slug,
  markLabel,
  doneLabel,
}: {
  slug: string;
  markLabel: string;
  doneLabel: string;
}) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    loadProgress,
    emptyProgress,
  );
  const done = Boolean(progress[slug]?.completed);

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: done ? "secondary" : "default" }))}
      onClick={() => {
        markCompleted(slug);
        track({ name: "mark_read", slug });
      }}
    >
      <Check className="size-4" />
      {done ? doneLabel : markLabel}
    </button>
  );
}
