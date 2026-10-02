import * as ort from "onnxruntime-node";
import { DenguePatientInput, DengueTriageResponse } from "@/lib/types";
import {
  buildFeatureVector,
  extractActiveRiskFactors,
  getOnnxSession,
} from "@/lib/utils";

const CALIBRATED_THRESHOLD = 0.3524;

export class PredictionRepository {
  /**
   * Executa a predição do modelo ONNX e aplica as regras de negócio de triagem.
   */
  public static async predictTriage(
    input: DenguePatientInput,
  ): Promise<DengueTriageResponse> {
    const featureArray = buildFeatureVector(input);

    // GUARDRAIL CLINICO: Trata casos assintomáticos que não pertençam a grupos de alto risco
    const somaSintomas = featureArray[24]; // Posição 25 no vetor (somaSintomas)
    const ehGrupoRiscoCritico = featureArray[25] === 1; // Posição 26 no vetor (pacienteGrupoRisco)

    if (somaSintomas === 0 && !ehGrupoRiscoCritico) {
      return {
        probabilidadeGrave: 0.05,
        riscoClassificacao: "LEVE / ACOMPANHAMENTO",
        thresholdUtilizado: CALIBRATED_THRESHOLD,
        fatoresDeRiscoAtivos: [
          "Paciente assintomático - Sem critérios de triagem para dengue aguda",
        ],
      };
    }

    // Inferência ONNX
    const sess = await getOnnxSession();
    const tensorInput = new ort.Tensor("float32", featureArray, [1, 40]);
    const results = await sess.run({ float_input: tensorInput });

    const outputName = sess.outputNames[1] || sess.outputNames[0];
    const probabilitiesTensor = results[outputName];

    let probaGrave = 0;
    if (probabilitiesTensor && probabilitiesTensor.data) {
      const data = probabilitiesTensor.data as Float32Array;
      probaGrave = data.length >= 2 ? data[1] : data[0];
    }

    const isGrave = probaGrave >= CALIBRATED_THRESHOLD;

    return {
      probabilidadeGrave: Number(probaGrave.toFixed(4)),
      riscoClassificacao: isGrave
        ? "ALERTA DE GRAVIDADE"
        : "LEVE / ACOMPANHAMENTO",
      thresholdUtilizado: CALIBRATED_THRESHOLD,
      fatoresDeRiscoAtivos: extractActiveRiskFactors(input, featureArray),
    };
  }
}
