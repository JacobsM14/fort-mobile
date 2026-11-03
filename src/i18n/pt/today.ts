import type { Translations } from "@/i18n/es";

export const todayTexts: Pick<Translations, "today"> = {
  today: {
    title: "O que há para hoje?",
    emptyTitle: "Ainda não tens rotinas",
    emptyMessage:
      "Cria a tua primeira rotina e escolhe-a sempre que fores treinar.",
    emptyAction: "Criar a minha primeira rotina",
    howItWorks: "Como funciona",
    steps: [
      "Cria as tuas rotinas uma única vez",
      "Seleciona os exercícios que quiseres",
      "No dia certo, escolhe uma e começa",
    ],
    pickRoutine: "Escolhe uma das tuas rotinas",
    start: "Iniciar",
    startRoutine: (name) => `Iniciar ${name}`,
    manageRoutines: "Gerir as minhas rotinas",
    inProgress: "Em curso",
    continue: "Continuar",
    continueRoutine: (name) => `Continuar ${name}`,
    activeTitle: "Tens um treino em curso",
    activeMessage: (current, next) =>
      `Vais concluir ${current} com as séries que marcaste e iniciar ${next}.`,
    activeConfirm: "Concluir e iniciar",
    cancel: "Cancelar",
    startError: "Não foi possível iniciar o treino",
  },
};
