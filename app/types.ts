export interface HospitalMetricsGridProps {
  totalTriagens: number;
  cidadeCliente: string;
  taxaGravidade: number;
  limiarPreditivo?: number;
}

export interface AgeSeverityData {
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
