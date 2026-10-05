"use client";

import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";

import { FilterPanel } from "./FilterPanel";
import { EpidemiologicalCharts } from "./EpidemiologicalCharts";
import { TriageForm } from "./TriageForm"; // Se tiver um componente de predição separado
import { BigQueryRawData } from "@/lib/chartUtils";
import type {
  DashboardClientProps,
  FilterState,
  QueryApiResponse,
} from "../types";
import { DashboardHeader } from "./DashboardHeader";
import { HospitalMetricsGrid } from "./MetricsGrid";
import { Info } from "@mui/icons-material";
import { defaultFilterState, DRAWER_WIDTH } from "../utils";

export const DashboardClient = ({
  initialData,
  metricsGridData,
}: DashboardClientProps) => {
  // Estado para controlar a aba lateral ativa (0 = Gráficos/Filtros, 1 = Predições)
  const [activeTab, setActiveTab] = useState<number>(0);

  const [data, setData] = useState<BigQueryRawData>(initialData);
  const [gridData, setGridData] = useState(metricsGridData);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const handleFilterChange = async ({
    newFilters,
    type = "data",
  }: {
    newFilters: FilterState;
    type: "data" | "gridData" | "all";
  }) => {
    setFilters(newFilters);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        scope: newFilters.scope,
        startYear: String(newFilters.startYear),
        endYear: String(newFilters.endYear),
        ageGroup: newFilters.ageGroup,
        gender: newFilters.gender,
        data: type === "data" || type === "all" ? "true" : "false",
        totais: type === "gridData" || type === "all" ? "true" : "false",
      });

      if (newFilters.symptoms.length > 0) {
        params.append("symptoms", newFilters.symptoms.join(","));
      }

      const response = await fetch(`/api/query?${params.toString()}`);

      if (!response.ok) {
        let detalhe = `status ${response.status}`;
        const corpo = await response.json();
        detalhe =
          corpo?.details ??
          corpo?.error ??
          corpo?.message ??
          JSON.stringify(corpo);
        throw new Error(`Erro ao buscar dados atualizados: ${detalhe}`);
      }

      const result: QueryApiResponse = await response.json();
      setData(result.data ?? initialData);
      setGridData(result.gridData ?? metricsGridData);
    } catch (error) {
      console.error("Falha ao atualizar dados epidemiológicos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 1. Menu Navegação Lateral (Sidebar Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary", fontWeight: "bold" }}
          >
            Painel Epidemiológico
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ whiteSpace: "pre-line" }}
          >
            Dengue & ML Predictive{"\n"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 9 }}
          >
            P.I. IV - DPR 12 - Univesp
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === 0}
              onClick={() => setActiveTab(0)}
            >
              <ListItemIcon>
                <Info color={activeTab === 0 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Início" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === 1}
              onClick={() => setActiveTab(1)}
            >
              <ListItemIcon>
                <BarChartIcon color={activeTab === 1 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Análise Histórica" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === 2}
              onClick={() => setActiveTab(2)}
            >
              <ListItemIcon>
                <TimelineIcon color={activeTab === 2 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Predições ML" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* 2. Área de Conteúdo Principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${DRAWER_WIDTH}px)` }}
      >
        {activeTab === 0 && (
          <>
            <DashboardHeader />{" "}
            <HospitalMetricsGrid
              {...gridData}
              onScopeChangeAction={(newScope) =>
                handleFilterChange({
                  newFilters: { ...filters, scope: newScope },
                  type: "gridData",
                })
              }
            />
          </>
        )}

        {activeTab === 1 && (
          <>
            <FilterPanel
              filters={filters}
              onChange={(newFilters) =>
                handleFilterChange({ newFilters, type: "data" })
              }
            />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <EpidemiologicalCharts
                key={JSON.stringify(data)}
                queryData={data}
              />
            )}
          </>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              Predição de Casos / Tendências (ML)
            </Typography>
            {/* Componente do Formulário e Gráficos de Predição */}
            <TriageForm />
          </Box>
        )}
      </Box>
    </Box>
  );
};
