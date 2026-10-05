import { NextRequest, NextResponse } from "next/server";
import { QueryRepository } from "@/lib/repositories/queryRepository";
import { QueryApiResponse, TerritorialScope } from "@/app/types";
import { parseBool } from "@/app/utils";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<QueryApiResponse>> {
  try {
    const { searchParams } = req.nextUrl;
    const totais = parseBool(searchParams.get("totais"));
    const data = parseBool(searchParams.get("data"));
    // 1. Busca os dados históricos do BigQuery
    const dadosHistoricos = data
      ? await QueryRepository.getDashboardData({
          scope: searchParams.get("scope") as TerritorialScope,
          startYear: Number(searchParams.get("startYear")),
          endYear: Number(searchParams.get("endYear")),
          ageGroup: searchParams.get("ageGroup") as string,
          gender: searchParams.get("gender") as string,
        })
      : undefined;

    const totaisAcumulados = {
      totalCasos: dadosHistoricos
        ? dadosHistoricos.timeSeries.reduce(
            (acc, curr) => acc + Number(curr.total_casos || 0),
            0,
          )
        : 0,
      totalObitos: dadosHistoricos
        ? dadosHistoricos.timeSeries.reduce(
            (acc, curr) => acc + Number(curr.obitos || 0),
            0,
          )
        : 0,
      casosGraves: dadosHistoricos
        ? dadosHistoricos.scatterData.reduce(
            (acc, curr) => acc + (curr.gravidade === 1 ? 1 : 0),
            0,
          )
        : 0,
    };

    const gridData = totais
      ? await QueryRepository.getHospitalMetricsGridData({
          scope: searchParams.get("scope") as TerritorialScope,
          startYear: Number(searchParams.get("startYear")),
          endYear: Number(searchParams.get("endYear")),
          ageGroup: searchParams.get("ageGroup") as string,
          gender: searchParams.get("gender") as string,
        })
      : undefined;

    return NextResponse.json({
      success: true,
      resumo: totaisAcumulados,
      ...(dadosHistoricos && { data: dadosHistoricos }),
      ...(gridData && { gridData }),
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
