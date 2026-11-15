import type { Translations } from "@/i18n/es";

export const settingsTexts: Pick<
  Translations,
  "settings" | "about" | "privacy"
> = {
  settings: {
    breadCrumb: "Perfil",
    title: "Configuració",
    appearance: "Aparença",
    themeOptions: {
      system: "Sistema",
      light: "Clar",
      dark: "Fosc",
    },
    language: "Idioma",
    closeLanguage: "Tanca els idiomes",
    languageOptions: {
      system: "Sistema",
      es: "Español",
      en: "English",
      ca: "Català",
      eu: "Euskara",
      fr: "Français",
      pt: "Português",
    },
    units: {
      weight: "Pes",
      distance: "Distància",
      system: "Auto",
    },
    user: {
      height: "Alçada",
      cm: "cm",
      feet: "ft",
      inches: "in",
      birthDate: "Data de naixement",
      day: "DD",
      month: "MM",
      year: "AAAA",
      intro:
        "Per calcular millor el teu IMC, indica la teva alçada i la data de naixement. L'alçada és obligatòria per calcular l'IMC, però l'edat també pot influir en el resultat.",
      invalidDate: "Aquesta data no existeix o encara no ha arribat.",
      gender: "Gènere",
      genders: {
        female: "Dona",
        male: "Home",
        other: "Altre / Prefereixo no dir-ho",
      },
    },
    data: {
      export: {
        title: "Exporta les dades",
        description:
          "Desa una còpia de les teves dades en un fitxer. Inclou el teu perfil, així que guarda'l en un lloc segur.",
        button: "Exporta",
        error: "No s'han pogut exportar les dades. Torna-ho a provar.",
      },
      import: {
        title: "Importa dades",
        description:
          "Recupera una còpia que hagis exportat abans. Es combina amb les teves dades i no s'esborra res.",
        button: "Tria un fitxer",
        confirmTitle: "Importa aquest fitxer",
        confirmMessage: (counts) =>
          `El fitxer conté:\nEntrenaments: ${counts.workouts}\nRutines: ${counts.routines}\nExercicis propis: ${counts.exercises}\nPesos corporals: ${counts.bodyWeights}\n\nEs combinarà amb les teves dades i no s'esborrarà res.`,
        confirm: "Importa",
        cancel: "Cancel·la",
        done: (counts) => {
          const items =
            counts.workouts +
            counts.routines +
            counts.exercises +
            counts.bodyWeights;
          if (items > 0) {
            return `Importat. Entrenaments: ${counts.workouts}, rutines: ${counts.routines}, exercicis propis: ${counts.exercises}, pesos: ${counts.bodyWeights}.`;
          }
          return counts.details > 0
            ? "S'han actualitzat exercicis o sèries de rutines i entrenaments que ja tenies."
            : "No hi havia res de nou per importar.";
        },
        skipped: (count) =>
          `Exercicis no importats perquè no existeixen en aquesta versió: ${count}.`,
        errors: {
          not_a_backup: "Aquest fitxer no és una còpia d'aquesta app.",
          unsupported_version:
            "Aquesta còpia és d'una versió més nova de l'app. Actualitza l'app per poder-la importar.",
          invalid:
            "Aquest fitxer està malmès o incomplet. No s'ha importat res.",
          failed: "No s'han pogut importar les dades. No s'ha canviat res.",
        },
      },
    },
    sections: {
      user: "Usuari",
      privacy: "Política de privadesa i llicències",
      notifications: "Notificacions",
      data: "Exportació / Importació",
      preferences: "Preferències",
      exercises: "Gestió d'exercicis",
      about: "Informació",
    },
    accent: {
      label: "Color",
      names: {
        orange: "Taronja",
        blue: "Blau",
        green: "Verd",
        purple: "Morat",
        pink: "Rosa",
        amber: "Ambre",
      },
    },
    notifications: {
      enabled: "Rebre notificacions",
      enabledDescription: "Desactiva-les per no rebre'n cap",
      blocked:
        "Les notificacions de l'app estan bloquejades a la configuració del mòbil.",
      openSystemSettings: "Obre la configuració del mòbil",
      types: "Quines notificacions vols rebre",
      workout: "Entrenament en curs",
      workoutDescription: "L'exercici que estàs fent i el temps que hi portes",
      weightReminder: "Recordatori per pesar-te",
      weightReminderDescription:
        "Un avís a la setmana per pesar-te. Si aquell dia ja t'has pesat, no sona.",
      day: "Dia",
      time: "Hora",
      hourEarlier: "Una hora abans",
      hourLater: "Una hora després",
      minutesEarlier: (minutes) => `${minutes} minuts abans`,
      minutesLater: (minutes) => `${minutes} minuts després`,
    },
  },
  about: {
    version: "Versió",
    contact: "Contacte",
    rate: "Valora l'app",
    tutorial: "Veure el tutorial",
    disclaimer: (appName) =>
      `${appName} no és un dispositiu mèdic i no diagnostica, tracta, cura ni prevé cap malaltia. Consulta un professional sanitari abans de començar un programa d'exercici.`,
  },
  privacy: {
    summary: (appName) =>
      `${appName} desa tot el que registres només en aquest dispositiu. No hi ha comptes, servidors, anuncis ni analítiques.`,
    storedTitle: "Què es desa",
    storedIntro: "A la base de dades de l'app, dins d'aquest dispositiu:",
    stored: [
      "Les teves rutines i els exercicis que afegeixes",
      "Els teus entrenaments, sèries i pesos",
      "El teu pes corporal, si el registres",
      "El teu perfil, si l'omples: alçada, data de naixement i gènere",
      "Les teves preferències: aparença, unitats i idioma",
    ],
    storedNotifications:
      "Les teves preferències de notificacions, amb el dia i l'hora del recordatori per pesar-te",
    security:
      "Aquestes dades es guarden a l'emmagatzematge privat de l'app, al qual el sistema no deixa accedir a altres apps.",
    notDoneTitle: "El que no fa l'app",
    notDone: [
      "Demanar-te un compte o dades personals obligatòries",
      "Enviar res a internet",
      "Fer servir analítiques ni seguiment",
      "Mostrar anuncis",
    ],
    backupsTitle: "Còpies de seguretat",
    backups:
      "Si tens activades les còpies de seguretat del sistema (iCloud o Google), les teves dades s'hi poden incloure, com les de qualsevol altra app. Aquestes còpies depenen del teu compte, no d'aquesta app.",
    exports:
      "També pots exportar les teves dades des de Configuració. Es crea un fitxer amb tot el que registres, inclòs el teu perfil, i tu decideixes on desar-lo o a qui enviar-lo. L'app només desa l'última còpia exportada, al seu emmagatzematge privat. En importar, l'app només llegeix el fitxer que triïs.",
    deleteTitle: "Esborrar les teves dades",
    delete:
      "Desinstal·lar l'app esborra tot el que tenia desat en aquest dispositiu. Les còpies que hagis exportat i desat en un altre lloc no s'esborren.",
    changesTitle: "Canvis",
    changes:
      "Si una versió futura canvia com es tracten les teves dades (per exemple, per sincronitzar-les entre dispositius), s'explicarà aquí abans que passi.",
    contactTitle: "Contacte",
    contact: "Dubtes sobre privadesa",
    licenseTitle: "Llicència",
    rightsReserved: "Tots els drets reservats.",
    thirdParty: "Programari de tercers",
    imagesTitle: "Imatges dels exercicis",
    images:
      "Les imatges dels exercicis s'han generat amb intel·ligència artificial (OpenAI).",
    lastUpdated: "Darrera actualització",
  },
};
