"use client";

import React, { useMemo } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  processTimeSeriesData,
  processSymptomsData,
  processAgeDistribution,
  processScatterData,
  processHeatmapData,
  formatNumber,
  formatPercent,
  tooltipNumberFormatter,
  tooltipPercentFormatter,
} from "@/lib/chartUtils";
import { EpidemiologicalChartsProps } from "../types"; // verificar questão de respostas truncadas na api

export const EpidemiologicalCharts: React.FC<EpidemiologicalChartsProps> = ({
  queryData,
  loading = false,
}) => {
  const timeSeries = useMemo(
    () => processTimeSeriesData(queryData?.timeSeries),
    [queryData?.timeSeries],
  );

  const symptoms = useMemo(
    () => processSymptomsData(queryData?.symptoms),
    [queryData?.symptoms],
  );

  const ageDistribution = useMemo(
    () => processAgeDistribution(queryData?.ageDistribution),
    [queryData?.ageDistribution],
  );

  const scatter = useMemo(
    () => processScatterData(queryData?.scatterData),
    [queryData?.scatterData],
  );

  const heatmap = useMemo(
    () => processHeatmapData(queryData?.heatmapData),
    [queryData?.heatmapData],
  );

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Carregando dados do BigQuery...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* 1. GRÁFICO DE LINHAS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              📈 Evolução Temporal (Gráfico de Linhas)
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ano" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(val) => formatNumber(val)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(val) => formatNumber(val)}
                />
                <Tooltip formatter={tooltipNumberFormatter} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="casos"
                  stroke="#38bdf8"
                  name="Casos Notificados"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="obitos"
                  stroke="#f43f5e"
                  name="Óbitos"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 2. GRÁFICO DE BARRAS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              📊 Prevalência de Sintomas (Gráfico de Barras)
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={symptoms} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="%" domain={[0, 100]} />
                <YAxis dataKey="sintoma" type="category" width={120} />
                <Tooltip formatter={tooltipPercentFormatter} />
                <Bar
                  dataKey="prevalencia"
                  fill="#0284c7"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 3. HISTOGRAMA */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              📉 Distribuição Demográfica (Histograma)
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ageDistribution} barCategoryGap={0}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis tickFormatter={(val) => formatNumber(val)} />
                <Tooltip formatter={tooltipNumberFormatter} />
                <Bar dataKey="frequencia" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 4. DISPERSÃO */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              🔵 Idade vs. Retardo de Notificação (Dispersão)
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="idade"
                  name="Idade"
                  unit=" anos"
                />
                <YAxis
                  type="number"
                  dataKey="diasNotificacao"
                  name="Dias até Notificação"
                  unit=" d"
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Pacientes" data={scatter} fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 5. MAPA DE CALOR */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              🔥 Intensidade Sazonal por Escopo (Mapa de Calor)
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 1.5,
                mt: 2,
              }}
            >
              {heatmap.map((row) => (
                <Box
                  key={row.mes}
                  sx={{
                    p: 1.5,
                    border: "1px solid #334155",
                    borderRadius: 1,
                    bgcolor: "background.default",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", mb: 1, color: "#f8fafc" }}
                  >
                    {row.mes}
                  </Typography>

                  {/* Barbosa */}
                  <Box
                    sx={{
                      p: 1,
                      mb: 0.5,
                      // Al multiplicar (row.Barbosa / 100) por un factor de intensidad (ex: 3),
                      // un 15% pasa a tener opacidad 0.45 en vez de 0.15.
                      bgcolor: `rgba(239, 68, 68, ${Math.min((row.Barbosa / 100) * 3 + 0.1, 1)})`,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      color: "#ffffff",
                    }}
                  >
                    Barbosa: {formatPercent(row.Barbosa)}
                  </Box>

                  {/* São Paulo */}
                  <Box
                    sx={{
                      p: 1,
                      mb: 0.5,
                      bgcolor: `rgba(239, 68, 68, ${Math.min((row.SP / 100) * 3 + 0.1, 1)})`,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      color: "#ffffff",
                    }}
                  >
                    São Paulo: {formatPercent(row.SP)}
                  </Box>

                  {/* Brasil */}
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: `rgba(239, 68, 68, ${Math.min((row.Brasil / 100) * 3 + 0.1, 1)})`,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      color: "#ffffff",
                    }}
                  >
                    Brasil: {formatPercent(row.Brasil)}
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
