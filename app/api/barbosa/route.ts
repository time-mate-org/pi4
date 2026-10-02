import { NextResponse } from "next/server";
import { BarbosaRepository } from "@/lib/repositories/queryRepository";

export async function GET() {
  try {
    // 1. Busca os dados históricos do BigQuery
    const dadosHistoricos = await BarbosaRepository.getDadosHistoricos();

    // 2. Opcional: Calcula totais acumulados para facilitar os Cards do MUI
    const totaisAcumulados = dadosHistoricos.reduce(
      (acc, curr) => {
        acc.total_casos += Number(curr.total_casos || 0);
        acc.casos_graves += Number(curr.casos_graves || 0);
        acc.obitos_dengue += Number(curr.obitos_dengue || 0);
        return acc;
      },
      { total_casos: 0, casos_graves: 0, obitos_dengue: 0 },
    );

    return NextResponse.json({
      success: true,
      resumo: totaisAcumulados,
      data: dadosHistoricos,
    });
  } catch (error) {
    console.error("Erro na rota de Barbosa:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao consultar dados históricos do município no BigQuery.",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}
