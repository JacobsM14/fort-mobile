import type { Translations } from "@/i18n/es";

export const todayTexts: Pick<Translations, "today"> = {
  today: {
    title: "Zer egingo duzu gaur?",
    emptyTitle: "Oraindik ez duzu errutinarik",
    emptyMessage:
      "Sortu zure lehen errutina, eta aukeratu entrenatzera zoazen egun bakoitzean.",
    emptyAction: "Sortu nire lehen errutina",
    howItWorks: "Nola funtzionatzen du",
    steps: [
      "Sortu zure errutinak behin bakarrik",
      "Hautatu nahi dituzun ariketak",
      "Dagokion egunean, aukeratu bat eta hasi",
    ],
    pickRoutine: "Aukeratu zure errutinetako bat",
    start: "Hasi",
    startRoutine: (name) => `Hasi ${name} errutinarekin`,
    manageRoutines: "Kudeatu nire errutinak",
    inProgress: "Abian",
    continue: "Jarraitu",
    continueRoutine: (name) => `Jarraitu ${name} errutinarekin`,
    activeTitle: "Entrenamendu bat duzu abian",
    activeMessage: (current, next) =>
      `${current} errutina amaitu egingo da markatu dituzun serieekin, eta ${next} errutina hasiko da.`,
    activeConfirm: "Amaitu eta hasi",
    cancel: "Utzi",
    startError: "Ezin izan da entrenamendua hasi",
  },
};
