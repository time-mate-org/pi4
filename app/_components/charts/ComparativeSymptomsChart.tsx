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
import { ComparativeSymptomsChartProps } from "@/app/types";

export function ComparativeSymptomsChart({
  data,
  nomeMunicipio,
  nomeEstado,
}: ComparativeSymptomsChartProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderColor: "rgba(255, 255, 255, 0.08)", height: "100%" }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Prevalência de Sintomas (%) - Comparativo Geográfico
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 3, display: "block" }}
      >
        Porcentagem de casos notificados com cada sintoma em relação ao total do
        local
      </Typography>

      <Box sx={{ height: 320, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="sintoma"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
            <Tooltip
              formatter={
                ((value: ValueType) => [
                  `${Number(value ?? 0).toFixed(1)}%`,
                  "Prevalência",
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
              dataKey="pctMunicipio"
              name={nomeMunicipio}
              fill="#0d9488"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pctEstado"
              name={nomeEstado}
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pctPais"
              name="Brasil"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
