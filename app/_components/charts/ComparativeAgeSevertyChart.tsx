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
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Formatter,
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ComparativeAgeSeverityChartProps } from "@/app/types";

export function ComparativeAgeSeverityChart({
  data,
  nomeMunicipio,
  nomeEstado,
}: ComparativeAgeSeverityChartProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderColor: "rgba(255, 255, 255, 0.08)", height: "100%" }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Taxa de Gravidade por Faixa Etária (%)
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 3, display: "block" }}
      >
        Porcentagem de quadros graves dentro de cada grupo etário
      </Typography>

      <Box sx={{ height: 320, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="faixa"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
            <Tooltip
              formatter={
                ((value: ValueType) => [
                  `${Number(value ?? 0).toFixed(1)}%`,
                  "Casos Graves",
                ]) as Formatter<ValueType, NameType>
              }
              contentStyle={{
                backgroundColor: "#111827",
                borderColor: "#374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend
              position="top"
              wrapperStyle={{ paddingBottom: 10, fontSize: "12px" }}
            />
            <Bar
              dataKey="taxaGraveMunicipio"
              name={nomeMunicipio}
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="taxaGraveEstado"
              name={nomeEstado}
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="taxaGravePais"
              name="Brasil"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
