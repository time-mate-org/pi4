import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// Interfaces dos dados vindos da Query do BigQuery
export interface BigQueryRawData {
  timeSeries: Array<{
    ano: string | number;
    total_casos: number;
    obitos: number;
  }>;
  symptoms: Array<{
    sintoma: string;
    total: number;
    porcentagem: number;
  }>;
  ageDistribution: Array<{
    faixa_etaria: string;
    total_casos: number;
  }>;
  scatterData: Array<{
    idade: number;
    dias_notificacao: number;
    gravidade: number;
  }>;
  heatmapData: Array<{
    mes: string;
    municipio_pct: number;
    estado_pct: number;
    brasil_pct: number;
  }>;
  hospitalizationData: Array<{
    ano: number;
    sg_uf: string;
    id_municip: number;
    total_casos: number;
    casos_hospitalizados: number;
    casos_graves: number;
    taxa_hospitalizacao: number;
  }>;
}

// Formatadores numéricos básicos
export const formatNumber = (value: number | string | undefined): string =>
  new Intl.NumberFormat("pt-BR").format(Number(value) || 0);

export const formatPercent = (value: number | string | undefined): string =>
  `${(Number(value) || 0).toFixed(1)}%`;

// Formatadores com tipagem compatível com a prop 'formatter' do Tooltip (Recharts v2+)
export const tooltipNumberFormatter = (
  value: ValueType | undefined,
  name?: NameType,
): [string, string] => [formatNumber(value as number), String(name || "")];

export const tooltipPercentFormatter = (
  value: ValueType | undefined,
  name?: NameType,
): [string, string] => [
  formatPercent(value as number),
  String(name || "Prevalência"),
];

// Processadores dos dados do BigQuery
export const processTimeSeriesData = (data: BigQueryRawData["timeSeries"]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    ano: String(item.ano || ""),
    casos: Number(item.total_casos) || 0,
    obitos: Number(item.obitos) || 0,
  }));
};

export const processSymptomsData = (data: BigQueryRawData["symptoms"]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    sintoma: item.sintoma || "Não informado",
    prevalencia: Number(item.porcentagem) || 0,
    total: Number(item.total) || 0,
  }));
};

export const processAgeDistribution = (
  data: BigQueryRawData["ageDistribution"],
) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    faixa: item.faixa_etaria || "N/A",
    frequencia: Number(item.total_casos) || 0,
  }));
};

export const processScatterData = (data: BigQueryRawData["scatterData"]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    idade: Number(item.idade) || 0,
    diasNotificacao: Number(item.dias_notificacao) || 0,
    gravidade: Number(item.gravidade) || 0,
  }));
};

export const processHeatmapData = (data: BigQueryRawData["heatmapData"]) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    mes: item.mes || "",
    Barbosa: Number(item.municipio_pct) || 0,
    SP: Number(item.estado_pct) || 0,
    Brasil: Number(item.brasil_pct) || 0,
  }));
};
