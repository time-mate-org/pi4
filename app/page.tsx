import { QueryRepository } from "@/lib/repositories/queryRepository";
import { DengueDashboardClient } from "./_components/Dashboard";

export const revalidate = 0; // Renderização dinâmica sem cache estático

export default async function DashboardPage() {
  // Busca os dados comparativos (Município, Estado e País) diretamente no BigQuery
  const comparativoData = await QueryRepository.getComparativoNacional();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <DengueDashboardClient
        initialComparativo={comparativoData}
        anoInicio={2014}
        anoFim={2024}
      />
    </main>
  );
}
