import { Box, Typography, Chip } from "@mui/material";

export function DashboardHeader() {
  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        py: 4,
        px: 2,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justify: "center",
        textAlign: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          color="primary.light"
          sx={{ fontWeight: "bold", whiteSpace: "pre-line" }}
        >
          {"Hospital de Barbosa\n"}{" "}
          <Chip
            label="SISTEMA DE TRIAGEM PREDITIVA"
            color="primary"
            size="small"
            variant="outlined"
          />
        </Typography>
      </Box>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ maxWidth: 600 }}
      >
        Painel epidemiológico de suporte à decisão clínica para notificações do
        SINAN em <strong>Barbosa - SP</strong>.
      </Typography>
    </Box>
  );
}
