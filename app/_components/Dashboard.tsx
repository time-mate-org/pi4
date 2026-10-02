"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
} from "@mui/material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";

import { DashboardHeader } from "./DashboardHeader";
import { HospitalMetricsGrid } from "./MetricsGrid";
import { EpidemiologicalCharts } from "./EpidemiologicalCharts";
import { TriageFormSection } from "./TriageForm";
import { DengueDashboardClientProps } from "@/lib/types";

export function DengueDashboardClient({
  initialComparativo,
  anoInicio,
  anoFim,
}: DengueDashboardClientProps) {
  // Estado para controlar o nível de visualização selecionado (municipio | estado | pais)
  const [visaoGeografica, setVisaoGeografica] = useState<
    "municipio" | "estado" | "pais"
  >("municipio");

  // Obtém os dados ativos com base na seleção
  const statsAtivas = initialComparativo[visaoGeografica];

  const handleVisaoChange = (
    _event: React.MouseEvent<HTMLElement>,
    novaVisao: "municipio" | "estado" | "pais" | null,
  ) => {
    if (novaVisao !== null) {
      setVisaoGeografica(novaVisao);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <DashboardHeader />

      {/* SELETOR DE VISÃO GEOGRÁFICA (MUNICÍPIO / ESTADO / BRASIL) */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderColor: "rgba(255, 255, 255, 0.08)",
          bgcolor: "background.paper",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Escopo dos Dados Epidemiológicos ({anoInicio} - {anoFim})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Selecione o nível de agregação para visualizar nos gráficos e
            métricas
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={visaoGeografica}
          exclusive
          onChange={handleVisaoChange}
          color="primary"
          size="small"
        >
          <ToggleButton value="municipio" sx={{ px: 2, gap: 1 }}>
            <LocationCityIcon fontSize="small" />
            {initialComparativo.municipio.nomeLocal}
          </ToggleButton>
          <ToggleButton value="estado" sx={{ px: 2, gap: 1 }}>
            <MapIcon fontSize="small" />
            {initialComparativo.estado.nomeLocal}
          </ToggleButton>
          <ToggleButton value="pais" sx={{ px: 2, gap: 1 }}>
            <PublicIcon fontSize="small" />
            {initialComparativo.pais.nomeLocal}
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* MÉTRICAS CHAVE */}
      <HospitalMetricsGrid
        totalTriagens={statsAtivas.totalTriagens}
        cidadeCliente={statsAtivas.nomeLocal}
        taxaGravidade={statsAtivas.taxaGravidade}
      />

      {/* SEÇÃO DO FORMULÁRIO DE TRIAGEM */}
      <Box sx={{ mb: 4 }}>
        <TriageFormSection />
      </Box>

      {/* GRÁFICOS EPIDEMIOLÓGICOS */}
      <EpidemiologicalCharts comparativo={initialComparativo} />
    </Container>
  );
}
