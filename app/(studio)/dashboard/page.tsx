import { Suspense } from "react";
import { DashboardHome } from "@/components/dashboard-home";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardHome />
    </Suspense>
  );
}
