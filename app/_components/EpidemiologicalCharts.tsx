"use client";

import React from "react";
import { Grid } from "@mui/material";
import { DashboardStats } from "@/lib/types";
import { ComparativeSymptomsChart } from "./charts/ComparativeSymptomsChart";
import { ComparativeAgeSeverityChart } from "./charts/ComparativeAgeSevertyChart";
import { ComparativePrevalenceChart } from "./charts/ComparativePrevalenceChart";

export interface EpidemiologicalChartsProps {
  comparativo: {
    municipio: DashboardStats;
    estado: DashboardStats;
    pais: DashboardStats;
  };
}

export function EpidemiologicalCharts({
  comparativo,
}: EpidemiologicalChartsProps) {
  const { municipio, estado, pais } = comparativo;

  // 1. Processamento Normalizado de Sintomas (%)
  const todosSintomas = [
    "Febre",
    "Cefaleia",
    "Mialgia",
    "Dor Articular",
    "Dor Retroorbital",
    "Exantema",
    "Vômito",
    "Náusea",
  ];

  const dadosSintomasComparativos = todosSintomas.map((sintoma) => {
    const totalMun =
      municipio.distribuicaoSintomas.find((s) => s.sintoma === sintoma)
        ?.total || 0;
    const totalEst =
      estado.distribuicaoSintomas.find((s) => s.sintoma === sintoma)?.total ||
      0;
    const totalPais =
      pais.distribuicaoSintomas.find((s) => s.sintoma === sintoma)?.total || 0;

    return {
      sintoma,
      pctMunicipio:
        municipio.totalTriagens > 0
          ? (totalMun / municipio.totalTriagens) * 100
          : 0,
      pctEstado:
        estado.totalTriagens > 0 ? (totalEst / estado.totalTriagens) * 100 : 0,
      pctPais:
        pais.totalTriagens > 0 ? (totalPais / pais.totalTriagens) * 100 : 0,
    };
  });

  // 2. Processamento Normalizado de Gravidade por Faixa Etária (%)
  const faixas = ["0-2 anos", "3-17 anos", "18-59 anos", "60+ anos"];

  const dadosFaixasEtariasComparativas = faixas.map((faixa) => {
    const munFaixa = municipio.faixasEtarias.find((f) => f.faixa === faixa);
    const estFaixa = estado.faixasEtarias.find((f) => f.faixa === faixa);
    const paisFaixa = pais.faixasEtarias.find((f) => f.faixa === faixa);

    const munTotal = (munFaixa?.leves || 0) + (munFaixa?.graves || 0);
    const estTotal = (estFaixa?.leves || 0) + (estFaixa?.graves || 0);
    const paisTotal = (paisFaixa?.leves || 0) + (paisFaixa?.graves || 0);

    return {
      faixa,
      taxaGraveMunicipio:
        munTotal > 0 ? ((munFaixa?.graves || 0) / munTotal) * 100 : 0,
      taxaGraveEstado:
        estTotal > 0 ? ((estFaixa?.graves || 0) / estTotal) * 100 : 0,
      taxaGravePais:
        paisTotal > 0 ? ((paisFaixa?.graves || 0) / paisTotal) * 100 : 0,
    };
  });

  return (
    <Grid container spacing={3}>
      {/* 1. Taxa Geral de Gravidade Comparativa */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <ComparativePrevalenceChart
          taxaMunicipio={municipio.taxaGravidade}
          taxaEstado={estado.taxaGravidade}
          taxaPais={pais.taxaGravidade}
          nomeMunicipio={municipio.nomeLocal}
          nomeEstado={estado.nomeLocal}
        />
      </Grid>

      {/* 2. Gravidade por Faixa Etária Comparativa */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <ComparativeAgeSeverityChart
          data={dadosFaixasEtariasComparativas}
          nomeMunicipio={municipio.nomeLocal}
          nomeEstado={estado.nomeLocal}
        />
      </Grid>

      {/* 3. Distribuição Relativa de Sintomas */}
      <Grid size={{ xs: 12 }}>
        <ComparativeSymptomsChart
          data={dadosSintomasComparativos}
          nomeMunicipio={municipio.nomeLocal}
          nomeEstado={estado.nomeLocal}
        />
      </Grid>
    </Grid>
  );
}
