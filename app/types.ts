import { BigQueryRawData } from "@/lib/chartUtils";

interface AgeSeverityData {
  faixa: string;
  taxaGraveMunicipio: number;
  taxaGraveEstado: number;
  taxaGravePais: number;
}

export interface ComparativeAgeSeverityChartProps {
  data: AgeSeverityData[];
  nomeMunicipio: string;
  nomeEstado: string;
}

export interface ComparativePrevalenceChartProps {
  taxaMunicipio: number;
  taxaEstado: number;
  taxaPais: number;
  nomeMunicipio: string;
  nomeEstado: string;
}

interface SymptomData {
  sintoma: string;
  pctMunicipio: number;
  pctEstado: number;
  pctPais: number;
}

export interface ComparativeSymptomsChartProps {
  data: SymptomData[];
  nomeMunicipio: string;
  nomeEstado: string;
}

export interface FilterState {
  scope: TerritorialScope;
  startYear: number;
  endYear: number;
  ageGroup: string;
  gender: string;
  symptoms: string[];
}

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
}

export interface EpidemiologicalChartsProps {
  queryData: BigQueryRawData;
  loading?: boolean;
}

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
}

export interface QueryApiResponse {
  data?: BigQueryRawData;
  gridData?: HospitalMetricsGridProps;
  resumo?: {
    totalCasos: number;
    totalObitos: number;
    casosGraves: number;
  };
  success: boolean;
  error?: string;
  details?: string;
}

export interface DashboardClientProps {
  initialData: BigQueryRawData;
  metricsGridData: HospitalMetricsGridProps;
}

export type TerritorialScope = "pais" | "estado" | "municipio";

export interface FilteredMetrics {
  totalCasos: number;
  casosGraves: number;
  taxaGravidade: number;
  taxaHospitalizacao: number;
  obitos: number;
  limiarPreditivo?: number;
}

export interface HospitalMetricsGridProps {
  scopo: TerritorialScope;
  cidadeCliente: string;
  estadoCliente: string;
  paisCliente?: string;
  metrics: FilteredMetrics;
  onScopeChangeAction?: (newScope: TerritorialScope) => Promise<void>;
}
