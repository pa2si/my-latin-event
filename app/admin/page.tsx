import StatsContainer from "@/components/admin/StatsContainer";
import ChartsContainer from "@/components/admin/ChartsContainer";
import { fetchAdminStats, fetchChartsData } from "@/utils/actions";
import HeaderSection from "@/components/shared/HeaderSection";
import { LayoutDashboard } from "lucide-react";

export default async function AdminPage() {
  const [stats, chartData] = await Promise.all([
    fetchAdminStats(),
    fetchChartsData(),
  ]);

  return (
    <>
      <HeaderSection
        title="Admin Dashboard"
        description="Overview of platform statistics and trends"
        icon={LayoutDashboard}
        breadcrumb={{
          name: "Admin Dashboard",
          parentPath: "/",
          parentName: "Home",
        }}
      />

      <div className="space-y-8">
        <StatsContainer stats={stats} />
        <ChartsContainer data={chartData} />
      </div>
    </>
  );
}
