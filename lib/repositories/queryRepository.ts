import { HospitalMetricsGridProps } from "@/app/types";
import { bigquery } from "@/lib/bigQuery"; // cliente já configurado (projectId + credentials)
import { BigQueryRawData } from "@/lib/chartUtils";
import { QueryFilters } from "../types";

const TABELA = "`basedosdados.br_ms_sinan.microdados_dengue`";

export class QueryRepository {
  private static bigquery = bigquery; // reaproveita o singleton configurado

  /**
   * Constrói a cláusula WHERE dinamicamente de acordo com os filtros passados.
   */
  private static buildWhereClause(
    filters: QueryFilters,
    options: { includeScope?: boolean } = {},
  ): string {
    const { includeScope = true } = options;
    const conditions: string[] = ["1=1"];

    // Filtro Temporal
    if (filters.startYear && filters.endYear) {
      conditions.push(
        `CAST(ano AS INT64) BETWEEN ${filters.startYear} AND ${filters.endYear}`,
      );
    }

    // Filtro Geográfico (Escopo) — usando município de RESIDÊNCIA, código IBGE de 7 dígitos.
    // includeScope=false é usado pela matriz sazonal, que precisa comparar município/estado/
    // Brasil ao mesmo tempo e não pode ficar restrita a um escopo só.
    if (includeScope) {
      if (filters.scope === "municipio") {
        conditions.push(`id_municipio_residencia = '3505104'`); // Barbosa - SP
      } else if (filters.scope === "estado") {
        conditions.push(`sigla_uf_residencia = 'SP'`);
      }
    }

    // Filtros Demográficos
    if (filters.ageGroup && filters.ageGroup !== "ALL") {
      if (filters.ageGroup === "0-14") conditions.push(`idade_paciente <= 14`);
      else if (filters.ageGroup === "15-59")
        conditions.push(`idade_paciente BETWEEN 15 AND 59`);
      else if (filters.ageGroup === "60+")
        conditions.push(`idade_paciente >= 60`);
    }

    // Lista de valores permitida (evita concatenar string vinda do cliente direto na query)
    if (filters.gender === "M" || filters.gender === "F") {
      conditions.push(`sexo_paciente = '${filters.gender}'`);
    }

    return conditions.join(" AND ");
  }

  /**
   * Executa as consultas consolidadas no BigQuery e retorna os dados formatados.
   */
  public static async getDashboardData(
    filters: QueryFilters,
  ): Promise<BigQueryRawData> {
    const whereClause = this.buildWhereClause(filters);

    // 1. Evolução Temporal (Série Histórica de Casos e Óbitos)
    // evolucao_caso = '2' -> óbito pelo agravo notificado (código confirmado anteriormente;
    // '3' é óbito por outra causa e não entra aqui).
    const timeSeriesQuery = `
      SELECT 
        CAST(ano AS STRING) AS ano,
        COUNT(1) AS total_casos,
        COUNTIF(evolucao_caso = '2') AS obitos
      FROM ${TABELA}
      WHERE ${whereClause}
      GROUP BY ano
      ORDER BY ano ASC
    `;

    // 2. Prevalência de Sintomas
    const symptomsQuery = `
      SELECT 
        'Febre' AS sintoma, COUNTIF(apresenta_febre = '1') AS total, ROUND(AVG(IF(apresenta_febre = '1', 100.0, 0.0)), 1) AS porcentagem FROM ${TABELA} WHERE ${whereClause}
      UNION ALL
      SELECT 'Mialgia', COUNTIF(apresenta_mialgia = '1'), ROUND(AVG(IF(apresenta_mialgia = '1', 100.0, 0.0)), 1) FROM ${TABELA} WHERE ${whereClause}
      UNION ALL
      SELECT 'Cefaleia', COUNTIF(apresenta_cefaleia = '1'), ROUND(AVG(IF(apresenta_cefaleia = '1', 100.0, 0.0)), 1) FROM ${TABELA} WHERE ${whereClause}
      UNION ALL
      SELECT 'Exantema', COUNTIF(apresenta_exantema = '1'), ROUND(AVG(IF(apresenta_exantema = '1', 100.0, 0.0)), 1) FROM ${TABELA} WHERE ${whereClause}
      UNION ALL
      SELECT 'Vômito', COUNTIF(apresenta_vomito = '1'), ROUND(AVG(IF(apresenta_vomito = '1', 100.0, 0.0)), 1) FROM ${TABELA} WHERE ${whereClause}
      UNION ALL
      SELECT 'Dor Retroorbital', COUNTIF(apresenta_dor_retroorbital = '1'), ROUND(AVG(IF(apresenta_dor_retroorbital = '1', 100.0, 0.0)), 1) FROM ${TABELA} WHERE ${whereClause}
    `;

    // 3. Distribuição por Faixa Etária (Histograma)
    const ageDistributionQuery = `
      SELECT 
        CASE 
          WHEN idade_paciente < 10 THEN '0-9 anos'
          WHEN idade_paciente BETWEEN 10 AND 19 THEN '10-19 anos'
          WHEN idade_paciente BETWEEN 20 AND 39 THEN '20-39 anos'
          WHEN idade_paciente BETWEEN 40 AND 59 THEN '40-59 anos'
          ELSE '60+ anos'
        END AS faixa_etaria,
        COUNT(1) AS total_casos
      FROM ${TABELA}
      WHERE ${whereClause} AND idade_paciente IS NOT NULL
      GROUP BY faixa_etaria
      ORDER BY MIN(idade_paciente)
    `;

    // 4. Retardo de Notificação (Dispersão)
    // data_notificacao e data_primeiros_sintomas são DATE nativas — confirmado no schema.
    // "gravidade" não pode mais ser um CAST direto para INT64: classificacao_final mistura
    // códigos ('11','12') e texto ('Dengue com Sinais de Alarme', 'Dengue Grave') na
    // mesma coluna. Em vez de tentar converter isso para número, agrupamos em 3 categorias
    // (0 = não classificado, 1 = outros, 2 = grave/sinais de alarme), usando o mesmo critério
    // de classificacao_final já usado na definição oficial de flag_caso_grave do notebook de ML.
    const scatterQuery = `
      SELECT 
        idade_paciente AS idade,
        DATE_DIFF(data_notificacao, data_primeiros_sintomas, DAY) AS dias_notificacao,
        CASE
          WHEN classificacao_final IS NULL THEN 0
          WHEN classificacao_final IN ('11', '12', 'Dengue com Sinais de Alarme', 'Dengue Grave') THEN 2
          ELSE 1
        END AS gravidade
      FROM ${TABELA}
      WHERE ${whereClause}
        AND idade_paciente IS NOT NULL
        AND data_notificacao IS NOT NULL
        AND data_primeiros_sintomas IS NOT NULL
      LIMIT 300
    `;

    // 5. Matriz de Intensidade Sazonal (Mapa de Calor)
    // Cada _pct agora é (casos daquele nível naquele mês) / (total de casos daquele nível no
    // período), e não mais "essa linha bate com o filtro que eu mesma apliquei" (por isso
    // antes dava sempre 100%). Por comparar os 3 níveis ao mesmo tempo, usa um WHERE sem o
    // filtro de escopo (includeScope: false) — só o período e os filtros demográficos valem.
    // mes_primeiros_sintomas não é coluna nativa; é derivada via EXTRACT, como no notebook.
    const whereClauseSemEscopo = this.buildWhereClause(filters, {
      includeScope: false,
    });
    const heatmapQuery = `
    WITH meses AS (
      SELECT mes_num FROM UNNEST(GENERATE_ARRAY(1, 12)) AS mes_num
    ),
    base AS (
      SELECT
        EXTRACT(MONTH FROM data_primeiros_sintomas) AS mes,
        id_municipio_residencia = '3505104' AS eh_municipio,
        sigla_uf_residencia = 'SP' AS eh_estado
      FROM ${TABELA}
      WHERE ${whereClauseSemEscopo} AND data_primeiros_sintomas IS NOT NULL
    ),
    totais AS (
      SELECT
        COUNTIF(eh_municipio) AS total_municipio,
        COUNTIF(eh_estado) AS total_estado,
        COUNT(1) AS total_brasil
      FROM base
    )
    SELECT
      CASE m.mes_num
        WHEN 1 THEN 'Jan' WHEN 2 THEN 'Fev' WHEN 3 THEN 'Mar' WHEN 4 THEN 'Abr'
        WHEN 5 THEN 'Mai' WHEN 6 THEN 'Jun' WHEN 7 THEN 'Jul' WHEN 8 THEN 'Ago'
        WHEN 9 THEN 'Set' WHEN 10 THEN 'Out' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dez'
      END AS mes,
      m.mes_num AS mes_numero,
      COALESCE(ROUND(100.0 * COUNTIF(b.eh_municipio) / NULLIF((SELECT total_municipio FROM totais), 0), 1), 0.0) AS municipio_pct,
      COALESCE(ROUND(100.0 * COUNTIF(b.eh_estado) / NULLIF((SELECT total_estado FROM totais), 0), 1), 0.0) AS estado_pct,
      COALESCE(ROUND(100.0 * COUNT(b.mes) / NULLIF((SELECT total_brasil FROM totais), 0), 1), 0.0) AS brasil_pct
    FROM meses m
    LEFT JOIN base b ON m.mes_num = b.mes
    GROUP BY m.mes_num
    ORDER BY m.mes_num;
    `;

    const taxaDeHospitalizacaoQuery = `SELECT
      ano,
      sigla_uf_notificacao,
      id_municipio_notificacao,
      
      -- Total de casos notificados
      COUNT(1) AS total_casos,
      
      -- Total de casos hospitalizados (onde internacao = '1')
      COUNTIF(internacao = '1') AS casos_hospitalizados,
      
      -- Cálculo da Taxa de Hospitalização (%)
      SAFE_DIVIDE(COUNTIF(internacao = '1') * 100.0, COUNT(1)) AS taxa_hospitalizacao,

      COUNTIF( classificacao_final IN ('11', '12', 'Dengue com Sinais de Alarme', 'Dengue Grave')) AS casos_graves

    FROM ${TABELA}
    WHERE ${this.buildWhereClause(filters)}
    GROUP BY ano, sigla_uf_notificacao, id_municipio_notificacao
    ORDER BY ano ASC;`;

    // Execução paralela das consultas no BigQuery
    const [
      [timeSeriesRows],
      [symptomsRows],
      [ageRows],
      [scatterRows],
      [hospitalizationRows],
      [heatmapRows],
    ] = await Promise.all([
      this.bigquery.query({ query: timeSeriesQuery }),
      this.bigquery.query({ query: symptomsQuery }),
      this.bigquery.query({ query: ageDistributionQuery }),
      this.bigquery.query({ query: scatterQuery }),
      this.bigquery.query({ query: taxaDeHospitalizacaoQuery }),
      this.bigquery.query({ query: heatmapQuery }),
    ]);

    return {
      timeSeries: timeSeriesRows,
      symptoms: symptomsRows,
      ageDistribution: ageRows,
      scatterData: scatterRows,
      heatmapData: heatmapRows,
      hospitalizationData: hospitalizationRows,
    };
  }

  public static async getHospitalMetricsGridData(
    filters: QueryFilters,
  ): Promise<HospitalMetricsGridProps> {
    const dados = await this.getDashboardData(filters);

    // 1. Total de Casos
    const totalCasos = dados.timeSeries.reduce(
      (acc, curr) => acc + Number(curr.total_casos || 0),
      0,
    );

    // 2. Casos Graves Reais (sem Dengue Clássica '10')
    const casosGraves = dados.hospitalizationData.reduce(
      (acc, curr) => acc + Number(curr.casos_graves || 0),
      0,
    );

    // 3. Taxa de Gravidade (%) Populacional
    const taxaGravidade = totalCasos > 0 ? (casosGraves / totalCasos) * 100 : 0;

    // 4. Casos Hospitalizados
    const casosHospitalizados = dados.hospitalizationData.reduce(
      (acc, curr) => acc + Number(curr.casos_hospitalizados || 0),
      0,
    );

    // 5. Taxa de Hospitalização (%) Populacional
    const taxaHospitalizacao =
      totalCasos > 0 ? (casosHospitalizados / totalCasos) * 100 : 0;

    // 6. Óbitos Totais
    const obitos = dados.timeSeries.reduce(
      (acc, curr) => acc + Number(curr.obitos || 0),
      0,
    );

    return {
      scopo: filters.scope,
      cidadeCliente: filters.scope === "municipio" ? "Barbosa" : "Barbosa",
      estadoCliente: filters.scope === "estado" ? "SP" : "SP",
      metrics: {
        totalCasos,
        casosGraves,
        taxaGravidade, // Retorna a % real calculada sobre totalCasos
        taxaHospitalizacao, // Retorna a % real de internados
        obitos,
      },
    };
  }
}
