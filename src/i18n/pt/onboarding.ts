import type { Translations } from "@/i18n/es";

export const onboardingTexts: Pick<Translations, "onboarding"> = {
  onboarding: {
    welcomeTitle: (app) => `Boas-vindas ao ${app}`,
    welcomeMessage:
      "Planeia as tuas rotinas, regista cada série e acompanha o teu progresso, tudo no telemóvel.",
    skip: "Saltar",
    previous: "Anterior",
    next: "Seguinte",
    finish: "Terminar",
    progress: (step, total) => `Passo ${step} de ${total}`,
    tour: {
      newRoutine: {
        title: "Cria as tuas rotinas",
        message:
          "Dá-lhes um nome e adiciona os exercícios. Só o fazes uma vez.",
      },
      picker: {
        title: "Escolhe os exercícios",
        message:
          "Procura no catálogo ou filtra por músculo. Se faltar algum, cria o teu.",
      },
      today: {
        title: "Escolhe o treino de hoje",
        message:
          "Cada dia treinado fica marcado na semana. Toca em Iniciar na rotina do dia.",
      },
      workout: {
        title: "Regista cada série",
        message:
          "Escreve o peso e as repetições, marca-a como feita e cronometra o descanso.",
      },
      progress: {
        title: "Vê como progrides",
        message:
          "Acompanha a força estimada de cada exercício e o teu peso corporal.",
      },
      history: {
        title: "Revê o teu histórico",
        message:
          "Todos os teus treinos e pesagens, dia a dia. Podes editá-los ou adicionar os que esqueceste.",
      },
    },
  },
};
