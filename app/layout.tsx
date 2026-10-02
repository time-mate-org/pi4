import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { hospitalTheme } from "@/theme/hospitalTheme";

export const metadata = {
  title:
    "Sistema de Triagem Preditiva de Dengue - Hospital Municipal de Barbosa",
  description: "Monitoramento Epidemiológico e Predição de Gravidade de Dengue",
  icons: {
    icon: "favicon.ico",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ backgroundColor: "#020617", color: "#f8fafc" }}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={hospitalTheme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
