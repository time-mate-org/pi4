"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DadosBarbosa,
  DenguePatientInput,
  DengueTriageResponse,
} from "@/lib/types";

export function TriageForm() {
  const [formData, setFormData] = useState<Partial<DadosBarbosa>>({
    // Demográficos
    idade_paciente: 30,
    sexo_paciente: "M",
    gestante_paciente: 0,
    raca_cor_paciente: 1,

    // Comorbidades Preexistentes
    possui_doenca_autoimune: 0,
    possui_diabetes: 0,
    possui_doencas_hematologicas: 0,
    possui_hepatopatias: 0,
    possui_doenca_renal: 0,
    possui_hipertensao: 0,
    possui_doenca_acido_peptica: 0,

    // Sinais e Sintomas Gerais
    apresenta_febre: 0,
    apresenta_cefaleia: 0,
    apresenta_exantema: 0,
    apresenta_dor_costas: 0,
    apresenta_prostacao: 0,
    apresenta_mialgia: 0,
    apresenta_vomito: 0,
    apresenta_nausea: 0,
    apresenta_diarreia: 0,
    apresenta_conjutivite: 0,
    apresenta_dor_retroorbital: 0,
    apresenta_artralgia: 0,
    apresenta_artrite: 0,
    apresenta_leucopenia: 0,

    // Sinais de Alarme & Manifestações Hemorrágicas
    apresenta_epistaxe: 0,
    apresenta_petequias: 0,
    apresenta_gengivorragia: 0,
    apresenta_metrorragia: 0,
    apresenta_hematuria: 0,
    apresenta_sangramento: 0,
    apresenta_ascite: 0,
    apresenta_pleurite: 0,
    apresenta_pericardite: 0,
    apresenta_dor_abdominal: 0,
    apresenta_hepatomegalia: 0,

    // Manifestações Graves e Disfunção Orgânica
    apresenta_miocardite: 0,
    apresenta_hipotensao: 0,
    apresenta_choque: 0,
    apresenta_insuficiencia_orgao: 0,
    prova_laco: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DengueTriageResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof DenguePatientInput,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar a predição.");
      }

      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erro inesperado ao processar a triagem.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
      {/* PAINEL COMPLETO DO FORMULÁRIO DE TRIAGEM */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper
          variant="outlined"
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, borderColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: "bold" }}>
            Formulário Clínico de Triagem Completa
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 2 }}
          >
            Avaliação multidimensional de sintomas, sinais de alarme e
            comorbidades para o modelo preditivo
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {/* 1. DADOS DEMOGRÁFICOS */}
          <Typography
            variant="subtitle2"
            color="primary.light"
            sx={{ mb: 1.5, fontWeight: "bold" }}
          >
            1. Dados Demográficos
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                label="Idade"
                type="number"
                size="small"
                value={formData.idade_paciente ?? ""}
                onChange={(e) =>
                  handleInputChange("idade_paciente", Number(e.target.value))
                }
                required
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                select
                label="Sexo"
                size="small"
                value={formData.sexo_paciente ?? "M"}
                onChange={(e) =>
                  handleInputChange("sexo_paciente", e.target.value)
                }
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Feminino</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                select
                label="Gestante"
                size="small"
                value={formData.gestante_paciente ?? 0}
                disabled={formData.sexo_paciente === "M"}
                onChange={(e) =>
                  handleInputChange("gestante_paciente", Number(e.target.value))
                }
              >
                <MenuItem value={0}>Não</MenuItem>
                <MenuItem value={1}>Sim</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                select
                label="Raça / Cor"
                size="small"
                value={formData.raca_cor_paciente ?? 1}
                onChange={(e) =>
                  handleInputChange("raca_cor_paciente", Number(e.target.value))
                }
              >
                <MenuItem value={1}>Branca</MenuItem>
                <MenuItem value={2}>Preta</MenuItem>
                <MenuItem value={3}>Amarela</MenuItem>
                <MenuItem value={4}>Parda</MenuItem>
                <MenuItem value={5}>Indígena</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* 2. COMORBIDADES (ACCORDION RECOLHÍVEL) */}
          <Accordion
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: "rgba(255, 255, 255, 0.08)",
              bgcolor: "background.paper",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle2"
                color="primary.light"
                sx={{ fontWeight: "bold" }}
              >
                2. Comorbidades Preexistentes
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {[
                  { key: "possui_hipertensao", label: "Hipertensão" },
                  { key: "possui_diabetes", label: "Diabetes Mellitus" },
                  { key: "possui_doenca_autoimune", label: "Doença Autoimune" },
                  {
                    key: "possui_doencas_hematologicas",
                    label: "Doença Hematológica",
                  },
                  { key: "possui_hepatopatias", label: "Hepatopatia" },
                  { key: "possui_doenca_renal", label: "Doença Renal" },
                  {
                    key: "possui_doenca_acido_peptica",
                    label: "Doença Ácido-Péptica",
                  },
                ].map(({ key, label }) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={key}>
                    <Paper
                      variant="outlined"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderColor: "rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="primary"
                            checked={Boolean(
                              formData[key as keyof DenguePatientInput],
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                key as keyof DenguePatientInput,
                                e.target.checked ? 1 : 0,
                              )
                            }
                          />
                        }
                        label={<Typography variant="body2">{label}</Typography>}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 3. SINTOMAS E SINAIS INICIAIS (ACCORDION RECOLHÍVEL) */}
          <Accordion
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: "rgba(255, 255, 255, 0.08)",
              bgcolor: "background.paper",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle2"
                color="primary.light"
                sx={{ fontWeight: "bold" }}
              >
                3. Sintomas e Sinais Iniciais
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {[
                  { key: "apresenta_febre", label: "Febre" },
                  { key: "apresenta_cefaleia", label: "Cefaleia" },
                  { key: "apresenta_mialgia", label: "Mialgia" },
                  { key: "apresenta_artralgia", label: "Artralgia" },
                  { key: "apresenta_artrite", label: "Artrite" },
                  {
                    key: "apresenta_dor_retroorbital",
                    label: "Dor Retroorbital",
                  },
                  { key: "apresenta_dor_costas", label: "Dor nas Costas" },
                  { key: "apresenta_exantema", label: "Exantema" },
                  { key: "apresenta_prostacao", label: "Prostração" },
                  { key: "apresenta_vomito", label: "Vômito" },
                  { key: "apresenta_nausea", label: "Náusea" },
                  { key: "apresenta_diarreia", label: "Diarreia" },
                  { key: "apresenta_conjutivite", label: "Conjuntivite" },
                  { key: "apresenta_leucopenia", label: "Leucopenia" },
                ].map(({ key, label }) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={key}>
                    <Paper
                      variant="outlined"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderColor: "rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="primary"
                            checked={Boolean(
                              formData[key as keyof DenguePatientInput],
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                key as keyof DenguePatientInput,
                                e.target.checked ? 1 : 0,
                              )
                            }
                          />
                        }
                        label={<Typography variant="body2">{label}</Typography>}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 4. SINAIS DE ALARME & QUADROS GRAVES (ACCORDION RECOLHÍVEL) */}
          <Accordion
            variant="outlined"
            sx={{
              mb: 3,
              borderColor: "rgba(244, 63, 94, 0.3)",
              bgcolor: "rgba(244, 63, 94, 0.03)",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle2"
                color="error.main"
                sx={{ fontWeight: "bold" }}
              >
                4. Sinais de Alarme, Hemorragias e Complicações Graves
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {[
                  {
                    key: "apresenta_dor_abdominal",
                    label: "Dor Abdominal Intensa",
                  },
                  { key: "apresenta_epistaxe", label: "Epistaxe" },
                  { key: "apresenta_petequias", label: "Petéquias" },
                  { key: "apresenta_gengivorragia", label: "Gengivorragia" },
                  { key: "apresenta_metrorragia", label: "Metrorragia" },
                  { key: "apresenta_hematuria", label: "Hematúria" },
                  {
                    key: "apresenta_sangramento",
                    label: "Outros Sangramentos",
                  },
                  { key: "apresenta_ascite", label: "Ascite" },
                  { key: "apresenta_pleurite", label: "Pleurite" },
                  { key: "apresenta_pericardite", label: "Pericardite" },
                  { key: "apresenta_hepatomegalia", label: "Hepatomegalia" },
                  { key: "apresenta_miocardite", label: "Miocardite" },
                  { key: "apresenta_hipotensao", label: "Hipotensão Arterial" },
                  { key: "apresenta_choque", label: "Quadro de Choque" },
                  {
                    key: "apresenta_insuficiencia_orgao",
                    label: "Insuficiência Orgânica",
                  },
                  { key: "prova_laco", label: "Prova do Laço Positiva" },
                ].map(({ key, label }) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={key}>
                    <Paper
                      variant="outlined"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderColor: "rgba(244, 63, 94, 0.2)",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="error"
                            checked={Boolean(
                              formData[key as keyof DenguePatientInput],
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                key as keyof DenguePatientInput,
                                e.target.checked ? 1 : 0,
                              )
                            }
                          />
                        }
                        label={<Typography variant="body2">{label}</Typography>}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calcular Risco de Gravidade"
            )}
          </Button>
        </Paper>
      </Grid>

      {/* PAINEL DE RESULTADO DA AVALIAÇÃO */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justify: "space-between",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
              Avaliação Diagnóstica
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 2 }}
            >
              Resultado gerado pelo motor de inferência em tempo real
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {result ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderColor:
                      result.riscoClassificacao === "ALERTA DE GRAVIDADE"
                        ? "error.main"
                        : "success.main",
                    bgcolor:
                      result.riscoClassificacao === "ALERTA DE GRAVIDADE"
                        ? "rgba(244, 63, 94, 0.1)"
                        : "rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                  >
                    Classificação de Risco
                  </Typography>
                  <Typography
                    variant="h5"
                    color={
                      result.riscoClassificacao === "ALERTA DE GRAVIDADE"
                        ? "error.main"
                        : "success.main"
                    }
                    sx={{ mt: 0.5, fontWeight: "bold" }}
                  >
                    {result.riscoClassificacao}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Probabilidade Estimada
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "800" }}>
                        {(result.probabilidadeGrave * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <Chip
                      label={`Corte: ${(result.thresholdUtilizado * 100).toFixed(1)}%`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Card>

                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "bold" }}
                    color="text.secondary"
                  >
                    Fatores de Risco Identificados
                  </Typography>
                  {result.fatoresDeRiscoAtivos.length > 0 ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {result.fatoresDeRiscoAtivos.map((fator, idx) => (
                        <Chip
                          key={idx}
                          label={fator}
                          color="warning"
                          variant="outlined"
                          size="small"
                          sx={{ justifyContent: "flex-start" }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      Nenhum fator crítico detectado.
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body2">
                  Preencha o formulário ao lado e execute a triagem para
                  visualizar a predição clínica.
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              pt: 2,
              mt: 3,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            Hospital Municipal de Barbosa • Modelo XGBoost v1.0.4 ONNX
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
