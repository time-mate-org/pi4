"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { FilterPanelProps } from "../types";

const SYMPTOM_OPTIONS = [
  "FEBRE",
  "MIALGIA",
  "CEFALEIA",
  "EXANTEMA",
  "VOMITO",
  "DOR_RETRO",
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
}) => {
  return (
    <Card sx={{ mb: 3, bgcolor: "background.paper", borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          🔍 Filtros de Análise Epidemiológica (SINAN)
        </Typography>
        <Grid container spacing={2}>
          {/* Escopo Geográfico */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Escopo Geográfico</InputLabel>
              <Select
                value={filters.scope}
                label="Escopo Geográfico"
                onChange={(e) =>
                  onChange({ ...filters, scope: e.target.value })
                }
              >
                <MenuItem value="municipio">Barbosa - SP</MenuItem>
                <MenuItem value="estado">São Paulo (Estado)</MenuItem>
                <MenuItem value="nacional">Brasil (Nacional)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Ano Inicial */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Ano Inicial</InputLabel>
              <Select
                value={filters.startYear}
                label="Ano Inicial"
                onChange={(e) =>
                  onChange({
                    ...filters,
                    startYear: Number(e.target.value),
                  })
                }
              >
                {Array.from({ length: 11 }, (_, i) => 2014 + i).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Faixa Etária */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Faixa Etária</InputLabel>
              <Select
                value={filters.ageGroup}
                label="Faixa Etária"
                onChange={(e) =>
                  onChange({ ...filters, ageGroup: e.target.value })
                }
              >
                <MenuItem value="ALL">Todas as Idades</MenuItem>
                <MenuItem value="0-14">0 a 14 anos</MenuItem>
                <MenuItem value="15-59">15 a 59 anos</MenuItem>
                <MenuItem value="60+">60+ anos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sexo */}
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sexo</InputLabel>
              <Select
                value={filters.gender}
                label="Sexo"
                onChange={(e) =>
                  onChange({ ...filters, gender: e.target.value })
                }
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Feminino</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sintomas Notificados */}
          <Grid size={{ xs: 12, sm: 12, md: 2.4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sintomas</InputLabel>
              <Select
                multiple
                value={filters.symptoms}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    symptoms:
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value,
                  })
                }
                input={<OutlinedInput label="Sintomas" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {SYMPTOM_OPTIONS.map((symptom) => (
                  <MenuItem key={symptom} value={symptom}>
                    {symptom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
