import type { Metadata } from "next";

import { DashboardManager } from "@/components/dashboard/dashboard-manager";

export const metadata: Metadata = {
  title: "Content Dashboard — Elysocrates Digital",
};

export default function DashboardPage() {
  return <DashboardManager />;
}
