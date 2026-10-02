"use client";

import { createTheme } from "@mui/material/styles";

export const hospitalTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#38bdf8", // Sky 400 - tom azul hospitalar/tecnológico
      light: "#7dd3fc", // Sky 300
      dark: "#0284c7", // Sky 600
      contrastText: "#0f172a",
    },
    secondary: {
      main: "#818cf8", // Indigo 400
      light: "#a5b4fc",
      dark: "#4f46e5",
    },
    background: {
      default: "#020617", // Slate 950 - Fundo principal escuro
      paper: "#0f172a", // Slate 900 - Fundo dos painéis e cards
    },
    text: {
      primary: "#f8fafc", // Slate 50
      secondary: "#94a3b8", // Slate 400
      disabled: "#64748b", // Slate 500
    },
    error: {
      main: "#f43f5e", // Rose 500 - Alertas de gravidade
      light: "#fb7185",
      dark: "#e11d48",
    },
    warning: {
      main: "#f59e0b", // Amber 500
      light: "#fbbf24",
      dark: "#d97706",
    },
    success: {
      main: "#10b981", // Emerald 500
      light: "#34d399",
      dark: "#059669",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // Remove o UPPERCASE automático dos botões
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        main: {
          backgroundColor: "#020617",
          color: "#f8fafc",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Desativa a elevação/overlay branca do MUI Dark
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          "&:before": {
            display: "none", // Remove a linha divisória padrão do Accordion
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default hospitalTheme;
