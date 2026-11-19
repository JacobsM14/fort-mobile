import type { Translations } from "@/i18n/es";

// Basque adds case endings to words, and an ending on a value that changes
// (an app name, a count) would often be wrong. Those values go after a noun
// that takes the ending ("${appName} aplikazioak") or after a colon.
export const settingsTexts: Pick<
  Translations,
  "settings" | "about" | "privacy"
> = {
  settings: {
    breadCrumb: "Profila",
    title: "Ezarpenak",
    appearance: "Itxura",
    themeOptions: {
      system: "Sistema",
      light: "Argia",
      dark: "Iluna",
    },
    language: "Hizkuntza",
    closeLanguage: "Itxi hizkuntzak",
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
      weight: "Pisua",
      distance: "Distantzia",
      system: "Auto",
    },
    user: {
      height: "Altuera",
      cm: "cm",
      feet: "ft",
      inches: "in",
      birthDate: "Jaiotze-data",
      day: "EE",
      month: "HH",
      year: "UUUU",
      intro:
        "Zure GMIa hobeto kalkulatzeko, adierazi zure altuera eta jaiotze-data. Altuera derrigorrezkoa da GMIa kalkulatzeko, baina adinak ere eragina izan dezake emaitzan.",
      invalidDate: "Data hori ez da existitzen edo oraindik ez da iritsi.",
      gender: "Generoa",
      genders: {
        female: "Emakumea",
        male: "Gizona",
        other: "Bestelakoa / Nahiago dut ez esan",
      },
    },
    data: {
      export: {
        title: "Esportatu datuak",
        description:
          "Gorde zure datuen kopia bat fitxategi batean. Zure profila ere badakar; beraz, gorde leku seguru batean.",
        button: "Esportatu",
        error: "Ezin izan dira datuak esportatu. Saiatu berriro.",
      },
      import: {
        title: "Inportatu datuak",
        description:
          "Berreskuratu lehenago esportatutako kopia bat. Zure datuekin konbinatzen da, eta ez da ezer ezabatzen.",
        button: "Aukeratu fitxategia",
        confirmTitle: "Inportatu fitxategi hau",
        confirmMessage: (counts) =>
          `Fitxategiak honako hauek ditu:\nEntrenamenduak: ${counts.workouts}\nErrutinak: ${counts.routines}\nZuk sortutako ariketak: ${counts.exercises}\nGorputz-pisuak: ${counts.bodyWeights}\n\nZure datuekin konbinatuko da, eta ez da ezer ezabatuko.`,
        confirm: "Inportatu",
        cancel: "Utzi",
        done: (counts) => {
          const items =
            counts.workouts +
            counts.routines +
            counts.exercises +
            counts.bodyWeights;
          if (items > 0) {
            return `Inportatuta. Entrenamenduak: ${counts.workouts}, errutinak: ${counts.routines}, zuk sortutako ariketak: ${counts.exercises}, pisuak: ${counts.bodyWeights}.`;
          }
          return counts.details > 0
            ? "Lehendik zenituen errutina eta entrenamenduetako ariketak edo serieak eguneratu dira."
            : "Ez zegoen ezer berririk inportatzeko.";
        },
        skipped: (count) =>
          `Bertsio honetan ez daudelako inportatu ez diren ariketak: ${count}.`,
        errors: {
          not_a_backup: "Fitxategi hori ez da aplikazio honen kopia bat.",
          unsupported_version:
            "Kopia hori aplikazioaren bertsio berriago batekoa da. Eguneratu aplikazioa inportatu ahal izateko.",
          invalid:
            "Fitxategi hori hondatuta edo osatu gabe dago. Ez da ezer inportatu.",
          failed: "Ezin izan dira datuak inportatu. Ez da ezer aldatu.",
        },
      },
    },
    sections: {
      user: "Erabiltzailea",
      privacy: "Pribatutasun-politika eta lizentziak",
      notifications: "Jakinarazpenak",
      data: "Esportatu / Inportatu",
      preferences: "Hobespenak",
      exercises: "Ariketen kudeaketa",
      about: "Honi buruz",
    },
    accent: {
      label: "Kolorea",
      names: {
        orange: "Laranja",
        blue: "Urdina",
        green: "Berdea",
        purple: "Morea",
        pink: "Arrosa",
        amber: "Anbarra",
      },
    },
    appIcon: {
      label: "Aplikazioaren ikonoa",
      note: "Ikonoa aplikaziotik irtetean aldatzen da.",
    },
    notifications: {
      enabled: "Jakinarazpenak jaso",
      enabledDescription: "Desaktibatu, bat ere ez jasotzeko",
      blocked:
        "Aplikazioaren jakinarazpenak blokeatuta daude telefonoaren ezarpenetan.",
      openSystemSettings: "Ireki telefonoaren ezarpenak",
      types: "Zer jakinarazpen jaso",
      workout: "Entrenamendua abian",
      workoutDescription: "Egiten ari zaren ariketa eta daramazun denbora",
      weightReminder: "Pisatzeko gogorarazpena",
      weightReminderDescription:
        "Astean behin pisatzeko abisua. Egun horretan dagoeneko pisatu bazara, ez du joko.",
      day: "Eguna",
      time: "Ordua",
      hourEarlier: "Ordubete lehenago",
      hourLater: "Ordubete geroago",
      minutesEarlier: (minutes) => `${minutes} minutu lehenago`,
      minutesLater: (minutes) => `${minutes} minutu geroago`,
    },
  },
  about: {
    version: "Bertsioa",
    contact: "Harremanetarako",
    rate: "Baloratu aplikazioa",
    tutorial: "Ikusi tutoriala",
    disclaimer: (appName) =>
      `${appName} ez da gailu medikoa, eta ez du inolako gaixotasunik diagnostikatzen, tratatzen, sendatzen edo prebenitzen. Kontsultatu osasun-profesional batekin ariketa-programa bat hasi aurretik.`,
  },
  privacy: {
    summary: (appName) =>
      `${appName} aplikazioak gailu honetan bakarrik gordetzen du erregistratzen duzun guztia. Ez dago konturik, zerbitzaririk, iragarkirik edo analitikarik.`,
    storedTitle: "Zer gordetzen den",
    storedIntro: "Aplikazioaren datu-basean, gailu honetan bertan:",
    stored: [
      "Zure errutinak eta gehitzen dituzun ariketak",
      "Zure entrenamenduak, serieak eta pisuak",
      "Zure gorputz-pisua, erregistratzen baduzu",
      "Zure profila, betetzen baduzu: altuera, jaiotze-data eta generoa",
      "Zure hobespenak: itxura, unitateak eta hizkuntza",
    ],
    storedNotifications:
      "Zure jakinarazpen-hobespenak, pisatzeko gogorarazpenaren eguna eta ordua barne",
    security:
      "Datu hauek aplikazioaren biltegiratze pribatuan daude, eta sistemak ez die beste aplikazioei bertara sartzen uzten.",
    notDoneTitle: "Aplikazioak egiten ez duena",
    notDone: [
      "Kontu bat edo nahitaezko datu pertsonalak eskatzea",
      "Datuak Internetera bidaltzea",
      "Analitikak edo jarraipena erabiltzea",
      "Iragarkiak erakustea",
    ],
    backupsTitle: "Babeskopiak",
    backups:
      "Sistemaren babeskopiak (iCloud edo Google) aktibatuta badituzu, zure datuak haietan sar daitezke, beste edozein aplikaziorenak bezala. Babeskopia horiek zure kontuaren mende daude, ez aplikazio honen mende.",
    exports:
      "Zure datuak Ezarpenak ataletik ere esporta ditzakezu. Erregistratzen duzun guztiarekin fitxategi bat sortzen da, zure profila barne, eta zuk erabakitzen duzu non gorde edo nori bidali. Aplikazioak esportatutako azken kopia bakarrik gordetzen du, bere biltegiratze pribatuan. Inportatzean, aukeratzen duzun fitxategia bakarrik irakurtzen du aplikazioak.",
    deleteTitle: "Zure datuak ezabatzea",
    delete:
      "Aplikazioa desinstalatzean, gailu honetan gordeta zuen guztia ezabatzen da. Esportatu eta beste nonbait gorde dituzun kopiak ez dira ezabatzen.",
    changesTitle: "Aldaketak",
    changes:
      "Etorkizuneko bertsio batek zure datuak tratatzeko modua aldatzen badu (adibidez, gailuen artean sinkronizatzeko), hemen azalduko da, gertatu aurretik.",
    contactTitle: "Harremanetarako",
    contact: "Pribatutasunari buruzko zalantzak",
    licenseTitle: "Lizentzia",
    rightsReserved: "Eskubide guztiak erreserbatuta.",
    thirdParty: "Hirugarrenen softwarea",
    imagesTitle: "Ariketen irudiak",
    images: "Ariketen irudiak adimen artifizialarekin sortu dira (OpenAI).",
    lastUpdated: "Azken eguneraketa",
  },
};
