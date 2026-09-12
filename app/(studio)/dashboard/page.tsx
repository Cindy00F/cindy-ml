import { DashboardHome } from "@/components/dashboard-home";
import type { Category } from "@/lib/articles";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const cat = (params.cat ?? "all") as Category | "all";
  return <DashboardHome q={q} cat={cat} />;
}
