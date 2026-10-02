"use client";

import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Formatter,
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ComparativePrevalenceChartProps } from "@/app/types";

export function ComparativePrevalenceChart({
  taxaMunicipio,
  taxaEstado,
  taxaPais,
  nomeMunicipio,
  nomeEstado,
}: ComparativePrevalenceChartProps) {
  const data = [
    { local: nomeMunicipio, taxa: taxaMunicipio, color: "#0d9488" },
    { local: nomeEstado, taxa: taxaEstado, color: "#0284c7" },
    { local: "Brasil", taxa: taxaPais, color: "#6366f1" },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderColor: "rgba(255, 255, 255, 0.08)", height: "100%" }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Índice Geral de Gravidade da Dengue (%)
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 3, display: "block" }}
      >
        Proporção de notificações classificadas como dengue grave ou de alarme
      </Typography>

      <Box sx={{ height: 280, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
            <YAxis
              type="category"
              dataKey="local"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <Tooltip
              formatter={
                ((value: ValueType) => [
                  `${Number(value ?? 0).toFixed(1)}%`,
                  "Taxa de Gravidade",
                ]) as Formatter<ValueType, NameType>
              }
              contentStyle={{
                backgroundColor: "#111827",
                borderColor: "#374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="taxa" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
