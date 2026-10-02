import { NextRequest, NextResponse } from "next/server";
import { PredictionRepository } from "@/lib/repositories/predictionRepository";
import { DenguePatientInput } from "@/lib/types";
import { validarInput } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body: DenguePatientInput = await req.json();

    // Validação completa do payload
    validarInput(body);

    // Delega 100% dos cálculos e inferência para a camada de serviço/repositório
    const result = await PredictionRepository.predictTriage(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar triagem ONNX:", error);
    return NextResponse.json(
      {
        error: "Falha na inferência do modelo de triagem",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
