import { bigquery } from "../bigQuery";
import { DadosBarbosa, DashboardStats, QueryFilters } from "../types";

export class QueryRepository {
  private static CODIGO_IBGE_DEFAULT = "3505104"; // Barbosa - SP
  private static SIGLA_UF_DEFAULT = "SP";
  private static ANO_INICIO_DEFAULT = 2014;
  private static ANO_FIM_DEFAULT = 2024;

  /**
   * Busca microdados brutos do BigQuery com suporte a filtros e limite de segurança para memória
   */
  public static async getMicrodados(
    filters: QueryFilters = {},
  ): Promise<DadosBarbosa[]> {
    const {
      codigoIbge,
      siglaUf,
      anoInicio = this.ANO_INICIO_DEFAULT,
      anoFim = this.ANO_FIM_DEFAULT,
      limiteRegistrosBrutos = 5000,
    } = filters;

    const conditions: string[] = ["ano BETWEEN @anoInicio AND @anoFim"];
    const params: Record<string, unknown> = { anoInicio, anoFim };

    if (codigoIbge) {
      conditions.push("id_municipio_notificacao = @codigoIbge");
      params.codigoIbge = codigoIbge;
    } else if (siglaUf) {
      conditions.push("sigla_uf_notificacao = @siglaUf");
      params.siglaUf = siglaUf;
    }

    const whereClause = conditions.join(" AND ");

    const query = `
      SELECT
        id_agravo, ano, sigla_uf_notificacao AS sigla_uf, idade_paciente, sexo_paciente, raca_cor_paciente,
        EXTRACT(MONTH FROM data_primeiros_sintomas) AS mes_primeiros_sintomas, gestante_paciente, possui_doenca_autoimune, possui_diabetes,
        possui_doencas_hematologicas, possui_hepatopatias, possui_doenca_renal, possui_hipertensao,
        possui_doenca_acido_peptica, apresenta_febre, apresenta_cefaleia, apresenta_exantema,
        apresenta_dor_costas, apresenta_prostacao, apresenta_mialgia, apresenta_vomito,
        apresenta_nausea, apresenta_diarreia, apresenta_conjutivite, apresenta_dor_retroorbital,
        apresenta_artralgia, apresenta_artrite, apresenta_leucopenia, apresenta_epistaxe,
        apresenta_petequias, apresenta_gengivorragia, apresenta_metrorragia, apresenta_hematuria,
        apresenta_sangramento, apresenta_complicacao, apresenta_ascite, apresenta_pleurite,
        apresenta_pericardite, apresenta_dor_abdominal, apresenta_hepatomegalia, apresenta_miocardite,
        apresenta_hipotensao, apresenta_choque, apresenta_insuficiencia_orgao, prova_laco,
        internacao, 
        CASE
          WHEN classificacao_final IN ('10', '11', '12', 'Dengue com Sinais de Alarme', 'Dengue Grave')
              OR evolucao_caso IN ('2', 'Óbito por dengue', 'Obito por dengue')
              OR grave_orgaos IN ('1', 'Sim') THEN 1
          ELSE 0
        END AS flag_caso_grave
      FROM \`basedosdados.br_ms_sinan.microdados_dengue\`
      WHERE ${whereClause}
      ORDER BY ano DESC
      LIMIT ${limiteRegistrosBrutos};
    `;

    const [rows] = await bigquery.query({ query, params });
    return rows as DadosBarbosa[];
  }

  /**
   * Agregação ultra-rápida diretamente no SQL do BigQuery.
   * Evita estourar o limite de memória Node/Next ao consultar o Estado ou o Brasil.
   */
  public static async getEstatisticasAgregadas(
    nivel: "municipio" | "estado" | "pais",
    filters: QueryFilters = {},
  ): Promise<DashboardStats> {
    const {
      codigoIbge = this.CODIGO_IBGE_DEFAULT,
      siglaUf = this.SIGLA_UF_DEFAULT,
      anoInicio = this.ANO_INICIO_DEFAULT,
      anoFim = this.ANO_FIM_DEFAULT,
    } = filters;

    const conditions: string[] = ["ano BETWEEN @anoInicio AND @anoFim"];
    const params: Record<string, unknown> = { anoInicio, anoFim };

    let nomeLocal = "Brasil";
    if (nivel === "municipio") {
      conditions.push("id_municipio_notificacao = @codigoIbge");
      params.codigoIbge = codigoIbge;
      nomeLocal = `Município (${codigoIbge})`;
    } else if (nivel === "estado") {
      conditions.push("sigla_uf_notificacao = @siglaUf");
      params.siglaUf = siglaUf;
      nomeLocal = `Estado (${siglaUf})`;
    }

    const whereClause = conditions.join(" AND ");

    const query = `
      WITH base_filtrada AS (
        SELECT
          idade_paciente,
          CASE
            WHEN classificacao_final IN ('10', '11', '12', 'Dengue com Sinais de Alarme', 'Dengue Grave')
                OR evolucao_caso IN ('2', 'Óbito por dengue', 'Obito por dengue')
                OR grave_orgaos IN ('1', 'Sim') THEN 1
            ELSE 0
          END AS is_grave,
          SAFE_CAST(apresenta_febre AS INT64) AS febre,
          SAFE_CAST(apresenta_cefaleia AS INT64) AS cefaleia,
          SAFE_CAST(apresenta_mialgia AS INT64) AS mialgia,
          SAFE_CAST(apresenta_artralgia AS INT64) AS dor_articular,
          SAFE_CAST(apresenta_dor_retroorbital AS INT64) AS dor_retroorbital,
          SAFE_CAST(apresenta_exantema AS INT64) AS exantema,
          SAFE_CAST(apresenta_vomito AS INT64) AS vomito,
          SAFE_CAST(apresenta_nausea AS INT64) AS nausea
        FROM \`basedosdados.br_ms_sinan.microdados_dengue\`
        WHERE ${whereClause}
      )
      SELECT
        COUNT(*) AS total_triagens,
        COUNTIF(is_grave = 1) AS total_graves,
        
        -- Sintomas
        COUNTIF(febre = 1) AS Febre,
        COUNTIF(cefaleia = 1) AS Cefaleia,
        COUNTIF(mialgia = 1) AS Mialgia,
        COUNTIF(dor_articular = 1) AS Dor_Articular,
        COUNTIF(dor_retroorbital = 1) AS Dor_Retroorbital,
        COUNTIF(exantema = 1) AS Exantema,
        COUNTIF(vomito = 1) AS Vomito,
        COUNTIF(nausea = 1) AS Nausea,

        -- Faixas Etárias x Gravidade
        COUNTIF(idade_paciente <= 2 AND is_grave = 0) AS f0_2_leves,
        COUNTIF(idade_paciente <= 2 AND is_grave = 1) AS f0_2_graves,
        COUNTIF(idade_paciente BETWEEN 3 AND 17 AND is_grave = 0) AS f3_17_leves,
        COUNTIF(idade_paciente BETWEEN 3 AND 17 AND is_grave = 1) AS f3_17_graves,
        COUNTIF(idade_paciente BETWEEN 18 AND 59 AND is_grave = 0) AS f18_59_leves,
        COUNTIF(idade_paciente BETWEEN 18 AND 59 AND is_grave = 1) AS f18_59_graves,
        COUNTIF(idade_paciente >= 60 AND is_grave = 0) AS f60_mais_leves,
        COUNTIF(idade_paciente >= 60 AND is_grave = 1) AS f60_mais_graves
      FROM base_filtrada;
    `;

    const [rows] = await bigquery.query({ query, params });
    const row = rows[0];

    const totalTriagens = Number(row?.total_triagens || 0);
    const totalGraves = Number(row?.total_graves || 0);
    const taxaGravidade =
      totalTriagens > 0
        ? Number(((totalGraves / totalTriagens) * 100).toFixed(1))
        : 0;

    const contagemSintomas = [
      { sintoma: "Febre", total: Number(row?.Febre || 0) },
      { sintoma: "Cefaleia", total: Number(row?.Cefaleia || 0) },
      { sintoma: "Mialgia", total: Number(row?.Mialgia || 0) },
      { sintoma: "Dor Articular", total: Number(row?.Dor_Articular || 0) },
      {
        sintoma: "Dor Retroorbital",
        total: Number(row?.Dor_Retroorbital || 0),
      },
      { sintoma: "Exantema", total: Number(row?.Exantema || 0) },
      { sintoma: "Vômito", total: Number(row?.Vomito || 0) },
      { sintoma: "Náusea", total: Number(row?.Nausea || 0) },
    ].sort((a, b) => b.total - a.total);

    const faixasEtarias = [
      {
        faixa: "0-2 anos",
        leves: Number(row?.f0_2_leves || 0),
        graves: Number(row?.f0_2_graves || 0),
      },
      {
        faixa: "3-17 anos",
        leves: Number(row?.f3_17_leves || 0),
        graves: Number(row?.f3_17_graves || 0),
      },
      {
        faixa: "18-59 anos",
        leves: Number(row?.f18_59_leves || 0),
        graves: Number(row?.f18_59_graves || 0),
      },
      {
        faixa: "60+ anos",
        leves: Number(row?.f60_mais_leves || 0),
        graves: Number(row?.f60_mais_graves || 0),
      },
    ];

    return {
      origem: nivel,
      nomeLocal,
      totalTriagens,
      taxaGravidade,
      distribuicaoSintomas: contagemSintomas,
      faixasEtarias,
    };
  }

  /**
   * Função utilitária para buscar estatísticas de Barbosa, Estado e Brasil em paralelo
   */
  public static async getComparativoNacional(
    codigoIbge = this.CODIGO_IBGE_DEFAULT,
    siglaUf = this.SIGLA_UF_DEFAULT,
    anoInicio = this.ANO_INICIO_DEFAULT,
    anoFim = this.ANO_FIM_DEFAULT,
  ) {
    const filters = { codigoIbge, siglaUf, anoInicio, anoFim };

    const [municipio, estado, pais] = await Promise.all([
      this.getEstatisticasAgregadas("municipio", filters),
      this.getEstatisticasAgregadas("estado", filters),
      this.getEstatisticasAgregadas("pais", filters),
    ]);

    return {
      municipio: { ...municipio, nomeLocal: "Barbosa - SP" },
      estado: { ...estado, nomeLocal: `Estado (${siglaUf})` },
      pais: { ...pais, nomeLocal: "Brasil" },
    };
  }
}
