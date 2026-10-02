import { DenguePatientInput } from "./types";

export const checkHomemGravido = (input: DenguePatientInput) => {
  if (input.sexo_paciente === "M" && input.gestante_paciente === 1) {
    throw new Error(
      "Combinação inválida: Paciente do sexo masculino não pode ser classificado como gestante.",
    );
  }
};

export const checkCriancaGravida = (input: DenguePatientInput) => {
  if (
    input.idade_paciente &&
    input.idade_paciente < 10 &&
    input.gestante_paciente === 1
  ) {
    throw new Error(
      "Combinação inválida: Idade incompatível com estado gestacional.",
    );
  }
};

export const checkIdadeValida = (input: DenguePatientInput) => {
  if (
    input.idade_paciente &&
    (input.idade_paciente < 0 || input.idade_paciente > 120)
  ) {
    throw new Error(
      "Idade inválida: A idade do paciente deve estar entre 0 e 120 anos.",
    );
  }
};

export const checkRacaValida = (input: DenguePatientInput) => {
  const racaValida = [1, 2, 3, 4, 5, 9];
  if (!racaValida.includes(input.raca_cor_paciente as number)) {
    throw new Error(
      "Raça/cor inválida: O valor deve ser um dos seguintes: 1 (Branca), 2 (Preta), 3 (Amarela), 4 (Parda), 5 (Indígena), 9 (Ignorado).",
    );
  }
};

export const validarInput = (input: DenguePatientInput) => {
  checkHomemGravido(input);
  checkCriancaGravida(input);
  checkIdadeValida(input);
  if (input.raca_cor_paciente !== undefined) {
    checkRacaValida(input);
  }
};
