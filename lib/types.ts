// Base contendo todos os atributos clínicos e demográficos compartilhados
export interface DenguePatientBase {
  idade_paciente: number;
  gestante_paciente?: number;
  sexo_paciente?: "F" | "I" | "M" | string;
  raca_cor_paciente?: number | string;

  // Comorbidades
  possui_doenca_autoimune?: number;
  possui_diabetes?: number;
  possui_doencas_hematologicas?: number;
  possui_hepatopatias?: number;
  possui_doenca_renal?: number;
  possui_hipertensao?: number;
  possui_doenca_acido_peptica?: number;

  // Sintomas e Sinais Clinicos
  apresenta_febre?: number;
  apresenta_cefaleia?: number;
  apresenta_exantema?: number;
  apresenta_dor_costas?: number;
  apresenta_prostacao?: number;
  apresenta_mialgia?: number;
  apresenta_vomito?: number;
  apresenta_nausea?: number;
  apresenta_diarreia?: number;
  apresenta_conjutivite?: number;
  apresenta_dor_retroorbital?: number;
  apresenta_artralgia?: number;
  apresenta_artrite?: number;
  apresenta_leucopenia?: number;
  prova_laco?: number;
}

// Front-end / Formulário: estende a base e restringe tipos específicos
export interface DenguePatientInput extends DenguePatientBase {
  sexo_paciente?: "F" | "I" | "M";
  raca_cor_paciente?: number;
}

// Microdados do BigQuery (SINAN): estende a base e inclui metadados e marcadores graves
export interface DadosBarbosa extends DenguePatientBase {
  id_agravo?: string;
  ano: number;
  sigla_uf?: string;
  mes_primeiros_sintomas?: number;

  // Sinais de alarme, hemorragias e gravidade orgânica
  apresenta_epistaxe?: number;
  apresenta_petequias?: number;
  apresenta_gengivorragia?: number;
  apresenta_metrorragia?: number;
  apresenta_hematuria?: number;
  apresenta_sangramento?: number;
  apresenta_complicacao?: number;
  apresenta_ascite?: number;
  apresenta_pleurite?: number;
  apresenta_pericardite?: number;
  apresenta_dor_abdominal?: number;
  apresenta_hepatomegalia?: number;
  apresenta_miocardite?: number;
  apresenta_hipotensao?: number;
  apresenta_choque?: number;
  apresenta_insuficiencia_orgao?: number;
  internacao?: number;
  flag_caso_grave: number | string;
}

// Respostas de Inferência
export interface DengueTriageResponse {
  probabilidadeGrave: number;
  riscoClassificacao: "ALERTA DE GRAVIDADE" | "LEVE / ACOMPANHAMENTO";
  thresholdUtilizado: number;
  fatoresDeRiscoAtivos: string[];
}

export interface ResultadoPredicao {
  taxa_gravidade_estimada: number;
  nivel_risco: "BAIXO" | "MÉDIO" | "ALTO";
}
export interface DashboardStats {
  origem: "municipio" | "estado" | "pais";
  nomeLocal: string;
  totalTriagens: number;
  taxaGravidade: number;
  distribuicaoSintomas: { sintoma: string; total: number }[];
  faixasEtarias: { faixa: string; leves: number; graves: number }[];
}

export interface QueryFilters {
  codigoIbge?: string;
  siglaUf?: string;
  anoInicio?: number;
  anoFim?: number;
  limiteRegistrosBrutos?: number;
}


export interface ComparativoNacionalStats {
  municipio: DashboardStats;
  estado: DashboardStats;
  pais: DashboardStats;
}

export interface DengueDashboardClientProps {
  initialComparativo: ComparativoNacionalStats;
  anoInicio: number;
  anoFim: number;
}


