"use client";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StatMinusIcon from "@mui/icons-material/ShowChart";
import { HospitalMetricsGridProps, TerritorialScope } from "../types";
import { useMemo, useState } from "react";

export function HospitalMetricsGrid({
  scopo,
  cidadeCliente,
  estadoCliente,
  paisCliente = "Brasil",
  metrics,
  onScopeChangeAction,
}: HospitalMetricsGridProps) {
  const [scope, setScope] = useState<TerritorialScope>(scopo);
  const [loading, setLoading] = useState<boolean>(false);

  const onScope = async (newScope: TerritorialScope) => {
    setScope(newScope);
    if (onScopeChangeAction) {
      setLoading(true);
      await onScopeChangeAction(newScope);
      setLoading(false);
    }
  };

  const locationLabel = useMemo(() => {
    switch (scope) {
      case "pais":
        return paisCliente;
      case "estado":
        return `Estado de ${estadoCliente}`;
      case "municipio":
      default:
        return `${cidadeCliente} - ${estadoCliente}`;
    }
  }, [scope, cidadeCliente, estadoCliente, paisCliente]);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Barra de Seleção de Escopo Territorial */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderColor: "rgba(255, 255, 255, 0.12)",
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Filtro Geográfico:
            </Typography>
            <Chip
              label={locationLabel}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="scope-select-label">Escopo Territorial</InputLabel>
            <Select
              labelId="scope-select-label"
              value={scope}
              label="Escopo Territorial"
              onChange={(e) => onScope(e.target.value as TerritorialScope)}
            >
              <MenuItem key="municipio" value="municipio">
                Município ({cidadeCliente})
              </MenuItem>
              <MenuItem key="estado" value="estado">
                Estado ({estadoCliente})
              </MenuItem>
              <MenuItem key="pais" value="pais">
                Nacional ({paisCliente})
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Grid de Cards com Métricas Dinâmicas */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
      ) : (
        <Grid container spacing={3}>
          {/* Total de Casos */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Total de Casos ({scope})
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ mt: 1, color: "#fff", fontWeight: "bold" }}
                >
                  {metrics.totalCasos.toLocaleString("pt-BR")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Casos Graves */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ReportProblemIcon color="error" fontSize="small" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                  >
                    Casos Graves Confirmados
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ mt: 1, color: "error.main", fontWeight: "bold" }}
                >
                  {metrics.casosGraves.toLocaleString("pt-BR")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Taxa Histórica de Gravidade */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Taxa de Gravidade
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ mt: 1, color: "warning.main", fontWeight: "bold" }}
                >
                  {metrics.taxaGravidade.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Taxa de Hospitalização */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalHospitalIcon color="info" fontSize="small" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                  >
                    Taxa de Hospitalização
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ mt: 1, color: "info.main", fontWeight: "bold" }}
                >
                  {metrics.taxaHospitalizacao.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Óbitos Registrados */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Óbitos Confirmados
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ mt: 1, color: "error.light", fontWeight: "bold" }}
                >
                  {metrics.obitos.toLocaleString("pt-BR")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Limiar Preditivo Calibrado */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StatMinusIcon color="primary" fontSize="small" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                  >
                    Limiar Preditivo Calibrado
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ mt: 1, color: "primary.light", fontWeight: "bold" }}
                >
                  {metrics.limiarPreditivo ?? 0.3524}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
