import * as ort from "onnxruntime-node";
import path from "path";
import { DenguePatientInput } from "@/lib/types";

let session: ort.InferenceSession | null = null;

/**
 * Singleton para carregar e reutilizar a sessão de inferência do ONNX.
 */
export async function getOnnxSession(): Promise<ort.InferenceSession> {
  if (!session) {
    const modelPath = path.join(
      process.cwd(),
      "lib",
      "models",
      "modelo_dengue_sp.onnx",
    );
    session = await ort.InferenceSession.create(modelPath);
  }
  return session;
}

/**
 * Converte o payload de entrada do paciente na matriz de 40 features esperada pelo ONNX.
 */
export function buildFeatureVector(input: DenguePatientInput): Float32Array {
  const temIdadeValida = typeof input.idade_paciente === "number";
  const idade = temIdadeValida ? input.idade_paciente : -1;

  const gestante = input.gestante_paciente === 1 ? 1 : 0;

  // Comorbidades
  const autoimune = input.possui_doenca_autoimune === 1 ? 1 : 0;
  const diabetes = input.possui_diabetes === 1 ? 1 : 0;
  const hematologicas = input.possui_doencas_hematologicas === 1 ? 1 : 0;
  const hepatopatias = input.possui_hepatopatias === 1 ? 1 : 0;
  const renal = input.possui_doenca_renal === 1 ? 1 : 0;
  const hipertensao = input.possui_hipertensao === 1 ? 1 : 0;
  const acidoPeptica = input.possui_doenca_acido_peptica === 1 ? 1 : 0;

  // Sintomas
  const febre = input.apresenta_febre === 1 ? 1 : 0;
  const cefaleia = input.apresenta_cefaleia === 1 ? 1 : 0;
  const exantema = input.apresenta_exantema === 1 ? 1 : 0;
  const dorCostas = input.apresenta_dor_costas === 1 ? 1 : 0;
  const prostacao = input.apresenta_prostacao === 1 ? 1 : 0;
  const mialgia = input.apresenta_mialgia === 1 ? 1 : 0;
  const vomito = input.apresenta_vomito === 1 ? 1 : 0;
  const nausea = input.apresenta_nausea === 1 ? 1 : 0;
  const diarreia = input.apresenta_diarreia === 1 ? 1 : 0;
  const conjutivite = input.apresenta_conjutivite === 1 ? 1 : 0;
  const dorRetroorbital = input.apresenta_dor_retroorbital === 1 ? 1 : 0;
  const artralgia = input.apresenta_artralgia === 1 ? 1 : 0;
  const artrite = input.apresenta_artrite === 1 ? 1 : 0;
  const leucopenia = input.apresenta_leucopenia === 1 ? 1 : 0;
  const provaLaco = input.prova_laco === 1 ? 1 : 0;

  // ENGENHARIA DE FEATURES
  const listaSintomas = [
    febre,
    cefaleia,
    exantema,
    dorCostas,
    prostacao,
    mialgia,
    vomito,
    nausea,
    diarreia,
    conjutivite,
    dorRetroorbital,
    artralgia,
    artrite,
    leucopenia,
    provaLaco,
  ];
  const somaSintomas = listaSintomas.reduce((acc, curr) => acc + curr, 0);

  const pacienteGrupoRisco =
    (temIdadeValida && (idade <= 2 || idade >= 60)) || gestante === 1 ? 1 : 0;

  const listaComorbidades = [
    autoimune,
    diabetes,
    hematologicas,
    hepatopatias,
    renal,
    hipertensao,
    acidoPeptica,
  ];
  const temComorbidade = listaComorbidades.some((c) => c === 1) ? 1 : 0;

  const sintomasSindrome = [
    cefaleia,
    mialgia,
    artralgia,
    exantema,
    dorRetroorbital,
  ];
  const countSindrome = sintomasSindrome.reduce((acc, curr) => acc + curr, 0);
  const sindromeClassicaDengue = febre === 1 && countSindrome >= 2 ? 1 : 0;

  const grupoRiscoComComorbidade =
    pacienteGrupoRisco === 1 && temComorbidade === 1 ? 1 : 0;

  // ONE-HOT ENCODING: Sexo
  const sexo = input.sexo_paciente || "MISSING_VALUE";
  const sexo_F = sexo === "F" ? 1 : 0;
  const sexo_I = sexo === "I" ? 1 : 0;
  const sexo_M = sexo === "M" ? 1 : 0;
  const sexo_MISSING = !["F", "I", "M"].includes(sexo) ? 1 : 0;

  // ONE-HOT ENCODING: Raça / Cor
  const raca = input.raca_cor_paciente;
  const raca_1 = raca === 1 ? 1 : 0;
  const raca_2 = raca === 2 ? 1 : 0;
  const raca_3 = raca === 3 ? 1 : 0;
  const raca_4 = raca === 4 ? 1 : 0;
  const raca_5 = raca === 5 ? 1 : 0;
  const raca_9 = raca === 9 ? 1 : 0;
  const raca_MISSING = ![1, 2, 3, 4, 5, 9].includes(raca as number) ? 1 : 0;

  return new Float32Array([
    /* 01 */ idade,
    /* 02 */ gestante,
    /* 03 */ autoimune,
    /* 04 */ diabetes,
    /* 05 */ hematologicas,
    /* 06 */ hepatopatias,
    /* 07 */ renal,
    /* 08 */ hipertensao,
    /* 09 */ acidoPeptica,
    /* 10 */ febre,
    /* 11 */ cefaleia,
    /* 12 */ exantema,
    /* 13 */ dorCostas,
    /* 14 */ prostacao,
    /* 15 */ mialgia,
    /* 16 */ vomito,
    /* 17 */ nausea,
    /* 18 */ diarreia,
    /* 19 */ conjutivite,
    /* 20 */ dorRetroorbital,
    /* 21 */ artralgia,
    /* 22 */ artrite,
    /* 23 */ leucopenia,
    /* 24 */ provaLaco,
    /* 25 */ somaSintomas,
    /* 26 */ pacienteGrupoRisco,
    /* 27 */ temComorbidade,
    /* 28 */ sindromeClassicaDengue,
    /* 29 */ grupoRiscoComComorbidade,
    /* 30 */ sexo_F,
    /* 31 */ sexo_I,
    /* 32 */ sexo_M,
    /* 33 */ sexo_MISSING,
    /* 34 */ raca_1,
    /* 35 */ raca_2,
    /* 36 */ raca_3,
    /* 37 */ raca_4,
    /* 38 */ raca_5,
    /* 39 */ raca_9,
    /* 40 */ raca_MISSING,
  ]);
}

/**
 * Mapeia e destaca os fatores de risco ativos no retorno da API.
 */
export function extractActiveRiskFactors(
  input: DenguePatientInput,
  features: Float32Array,
): string[] {
  const fatores: string[] = [];

  if (features[27] === 1)
    fatores.push(
      "Soma a combinação de sintomas de Síndrome Clássica de Dengue",
    );
  if (features[25] === 1)
    fatores.push("Paciente em Grupo de Risco (Idoso, Bebê ou Gestante)");
  if (features[26] === 1) fatores.push("Possui Comorbidade Preexistente");
  if (features[28] === 1)
    fatores.push("Apresenta Duplo Risco (Grupo de Risco + Comorbidade)");
  if (input.prova_laco === 1) fatores.push("Prova do Laço Positiva");

  return fatores;
}
