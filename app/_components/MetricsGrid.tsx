"use client";

import { Grid, Card, CardContent, Typography } from "@mui/material";
import { HospitalMetricsGridProps } from "../types";

export function HospitalMetricsGrid({
  totalTriagens,
  cidadeCliente,
  taxaGravidade,
  limiarPreditivo = 0.3524,
}: HospitalMetricsGridProps) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            bgcolor: "background.paper",
          }}
        >
          <CardContent>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              Total de Casos Notificados ({cidadeCliente})
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 1, color: "#fff", fontWeight: "bold" }}
            >
              {totalTriagens.toLocaleString("pt-BR")}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            bgcolor: "background.paper",
          }}
        >
          <CardContent>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              Taxa Histórica de Gravidade
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 1, color: "warning.main", fontWeight: "bold" }}
            >
              {taxaGravidade}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            bgcolor: "background.paper",
          }}
        >
          <CardContent>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              Limiar Preditivo Calibrado
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 1, color: "primary.light", fontWeight: "bold" }}
            >
              {limiarPreditivo}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
