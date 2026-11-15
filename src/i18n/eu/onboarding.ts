import type { Translations } from "@/i18n/es";

export const onboardingTexts: Pick<Translations, "onboarding"> = {
  onboarding: {
    welcomeTitle: (app) => `Ongi etorri ${app}-era`,
    welcomeMessage:
      "Planifikatu zure errutinak, idatzi serie bakoitza eta jarraitu zure aurrerapena, dena mugikorrean.",
    skip: "Saltatu",
    previous: "Aurrekoa",
    next: "Hurrengoa",
    finish: "Amaitu",
    progress: (step, total) => `${step}. urratsa, ${total}etik`,
    setup: "Konfigurazioa",
    doneTitle: "Dena prest",
    doneMessage:
      "Orain zure lehen errutina sor dezakezu. Nahi baduzu, aplikazioak nola funtzionatzen duen erakutsiko dizugu une batean.",
    seeTutorial: "Ikusi tutoriala",
    startWithoutTutorial: "Hasi tutorialik gabe",
    tour: {
      newRoutine: {
        title: "Sortu zure errutinak",
        message:
          "Jarri izena eta gehitu ariketak. Behin bakarrik egin behar duzu.",
      },
      picker: {
        title: "Aukeratu ariketak",
        message:
          "Bilatu katalogoan edo iragazi giharraren arabera. Bat falta bada, sortu zurea.",
      },
      today: {
        title: "Aukeratu gaur zer egin",
        message:
          "Entrenatutako egun bakoitza astean markatzen da. Sakatu Hasi eguneko errutinan.",
      },
      workout: {
        title: "Idatzi serie bakoitza",
        message:
          "Idatzi pisua eta errepikapenak, markatu egindakotzat eta neurtu atsedena.",
      },
      progress: {
        title: "Ikusi zure aurrerapena",
        message:
          "Jarraitu ariketa bakoitzaren indar estimatua eta zure gorputz-pisua.",
      },
      history: {
        title: "Errepasatu zure historia",
        message:
          "Entrenamendu eta pisu guztiak, egunez egun. Editatu ditzakezu edo ahaztutakoak gehitu.",
      },
    },
  },
};
