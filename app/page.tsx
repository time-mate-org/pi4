import { QueryRepository } from "@/lib/repositories/queryRepository";
import { DashboardClient } from "./_components/Dashboard";
import { HospitalMetricsGridProps } from "./types";
import { defaultFilterState } from "./utils";

export default async function Page() {
  // Carga inicial dos dados diretamente do BigQuery via Repositório no Server Side
  const initialData =
    await QueryRepository.getDashboardData(defaultFilterState);

  const metricsGridData: HospitalMetricsGridProps =
    await QueryRepository.getHospitalMetricsGridData(defaultFilterState);

  return (
    <main style={{ minHeight: "100vh", padding: "16px" }}>
      <DashboardClient
        initialData={initialData}
        metricsGridData={metricsGridData}
      />
    </main>
  );
}
