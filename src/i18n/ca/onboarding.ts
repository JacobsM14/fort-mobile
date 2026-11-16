import type { Translations } from "@/i18n/es";

export const onboardingTexts: Pick<Translations, "onboarding"> = {
  onboarding: {
    welcomeTitle: (app) => `Benvingut a ${app}`,
    welcomeMessage:
      "Planifica les teves rutines, apunta cada sèrie i segueix el teu progrés, tot al mòbil.",
    skip: "Omet",
    previous: "Anterior",
    next: "Següent",
    finish: "Acaba",
    progress: (step, total) => `Pas ${step} de ${total}`,
    setup: "Configuració",
    doneTitle: "Tot a punt",
    doneMessage:
      "Ja pots crear la teva primera rutina. Si vols, t'ensenyem en un moment com funciona l'app.",
    seeTutorial: "Veure el tutorial",
    startWithoutTutorial: "Començar sense tutorial",
    tour: {
      newRoutine: {
        title: "Crea les teves rutines",
        message:
          "Posa'ls nom i afegeix-hi els exercicis. Només ho has de fer una vegada.",
      },
      picker: {
        title: "Tria els exercicis",
        message:
          "Cerca al catàleg o filtra per múscul. Si en falta algun, crea el teu.",
      },
      today: {
        title: "Tria què toca avui",
        message:
          "Cada dia entrenat queda marcat a la setmana. Prem Comença a la rutina del dia.",
      },
      workout: {
        title: "Apunta cada sèrie",
        message:
          "Escriu el pes i les repeticions, marca-la com a feta i cronometra el descans.",
      },
      progress: {
        title: "Mira com progresses",
        message:
          "Segueix la força estimada de cada exercici i el teu pes corporal.",
      },
      history: {
        title: "Repassa el teu historial",
        message:
          "Tots els entrenaments i els pesos, dia a dia. Pots editar-los o afegir els que vas oblidar.",
      },
    },
  },
};
