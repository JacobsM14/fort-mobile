import type { Translations } from "@/i18n/es";

export const settingsTexts: Pick<
  Translations,
  "settings" | "about" | "privacy"
> = {
  settings: {
    breadCrumb: "Profil",
    title: "Réglages",
    appearance: "Apparence",
    themeOptions: {
      system: "Système",
      light: "Clair",
      dark: "Sombre",
    },
    language: "Langue",
    closeLanguage: "Fermer les langues",
    languageOptions: {
      system: "Système",
      es: "Español",
      en: "English",
      ca: "Català",
      eu: "Euskara",
      fr: "Français",
      pt: "Português",
    },
    units: {
      weight: "Poids",
      distance: "Distance",
      system: "Auto",
    },
    user: {
      height: "Taille",
      cm: "cm",
      feet: "ft",
      inches: "in",
      birthDate: "Date de naissance",
      day: "JJ",
      month: "MM",
      year: "AAAA",
      intro:
        "Pour mieux calculer ton IMC, indique ta taille et ta date de naissance. La taille est obligatoire pour calculer l'IMC, mais l'âge peut aussi influer sur le résultat.",
      invalidDate: "Cette date n'existe pas ou est dans le futur.",
      gender: "Genre",
      genders: {
        female: "Femme",
        male: "Homme",
        other: "Autre / Je préfère ne pas le dire",
      },
    },
    data: {
      export: {
        title: "Exporter les données",
        description:
          "Enregistre une copie de tes données dans un fichier. Elle inclut ton profil, alors garde-la en lieu sûr.",
        button: "Exporter",
        error: "Impossible d'exporter les données. Réessaie.",
      },
      import: {
        title: "Importer des données",
        description:
          "Restaure une copie exportée auparavant. Elle est fusionnée avec tes données et rien n'est supprimé.",
        button: "Choisir un fichier",
        confirmTitle: "Importer ce fichier",
        confirmMessage: (counts) =>
          `Le fichier contient :\nEntraînements : ${counts.workouts}\nRoutines : ${counts.routines}\nExercices personnalisés : ${counts.exercises}\nPesées : ${counts.bodyWeights}\n\nIl sera fusionné avec tes données et rien ne sera supprimé.`,
        confirm: "Importer",
        cancel: "Annuler",
        done: (counts) => {
          const items =
            counts.workouts +
            counts.routines +
            counts.exercises +
            counts.bodyWeights;
          if (items > 0) {
            return `Importation terminée. Entraînements : ${counts.workouts}, routines : ${counts.routines}, exercices personnalisés : ${counts.exercises}, pesées : ${counts.bodyWeights}.`;
          }
          return counts.details > 0
            ? "Des exercices ou des séries de routines et d'entraînements que tu avais déjà ont été mis à jour."
            : "Il n'y avait rien de nouveau à importer.";
        },
        skipped: (count) =>
          `Exercices non importés car ils n'existent pas dans cette version : ${count}.`,
        errors: {
          not_a_backup: "Ce fichier n'est pas une sauvegarde de cette app.",
          unsupported_version:
            "Cette sauvegarde provient d'une version plus récente de l'app. Mets l'app à jour pour pouvoir l'importer.",
          invalid:
            "Ce fichier est endommagé ou incomplet. Rien n'a été importé.",
          failed: "Impossible d'importer les données. Rien n'a été modifié.",
        },
      },
    },
    sections: {
      user: "Utilisateur",
      privacy: "Politique de confidentialité et licences",
      notifications: "Notifications",
      data: "Exporter / Importer",
      preferences: "Préférences",
      exercises: "Gérer les exercices",
      about: "À propos",
    },
    accent: {
      label: "Couleur",
      names: {
        orange: "Orange",
        blue: "Bleu",
        green: "Vert",
        purple: "Violet",
        pink: "Rose",
        amber: "Ambre",
      },
    },
    notifications: {
      enabled: "Recevoir des notifications",
      enabledDescription: "Désactive-les pour n'en recevoir aucune",
      blocked:
        "Les notifications de l'app sont bloquées dans les réglages du téléphone.",
      openSystemSettings: "Ouvrir les réglages du téléphone",
      types: "Notifications à recevoir",
      workout: "Entraînement en cours",
      workoutDescription: "L'exercice en cours et le temps écoulé",
      weightReminder: "Rappel de pesée",
      weightReminderDescription:
        "Un rappel par semaine pour te peser. Si ta pesée du jour est déjà faite, il reste silencieux.",
      day: "Jour",
      time: "Heure",
      hourEarlier: "Une heure plus tôt",
      hourLater: "Une heure plus tard",
      minutesEarlier: (minutes) => `${minutes} minutes plus tôt`,
      minutesLater: (minutes) => `${minutes} minutes plus tard`,
    },
  },
  about: {
    version: "Version",
    contact: "Contact",
    rate: "Noter l'app",
    tutorial: "Voir le tutoriel",
    disclaimer: (appName) =>
      `${appName} n'est pas un dispositif médical et ne diagnostique, ne traite, ne guérit ni ne prévient aucune maladie. Consulte un professionnel de santé avant de commencer un programme d'exercice.`,
  },
  privacy: {
    summary: (appName) =>
      `${appName} enregistre tout ce que tu saisis uniquement sur cet appareil. Pas de compte, de serveur, de publicité ni d'outil d'analyse.`,
    storedTitle: "Ce qui est enregistré",
    storedIntro: "Dans la base de données de l'app, sur cet appareil :",
    stored: [
      "Tes routines et les exercices que tu ajoutes",
      "Tes entraînements, séries et charges",
      "Ton poids corporel, si tu le saisis",
      "Ton profil, si tu le remplis : taille, date de naissance et genre",
      "Tes préférences : apparence, unités et langue",
    ],
    storedNotifications:
      "Tes préférences de notifications, avec le jour et l'heure du rappel de pesée",
    security:
      "Ces données se trouvent dans le stockage privé de l'app, auquel le système interdit l'accès aux autres apps.",
    notDoneTitle: "Ce que l'app ne fait pas",
    notDone: [
      "Te demander un compte ou des données personnelles obligatoires",
      "Envoyer quoi que ce soit sur internet",
      "Utiliser des outils d'analyse ou de suivi",
      "Afficher des publicités",
    ],
    backupsTitle: "Sauvegardes",
    backups:
      "Si les sauvegardes du système (iCloud ou Google) sont activées, tes données peuvent y être incluses, comme celles de n'importe quelle autre app. Ces sauvegardes dépendent de ton compte, pas de cette app.",
    exports:
      "Tu peux aussi exporter tes données depuis les Réglages. Cela crée un fichier avec tout ce que tu saisis, ton profil compris, et c'est toi qui décides où l'enregistrer ou à qui l'envoyer. L'app ne garde que la dernière copie exportée, dans son stockage privé. Lors d'une importation, l'app lit uniquement le fichier que tu choisis.",
    deleteTitle: "Supprimer tes données",
    delete:
      "Désinstaller l'app supprime tout ce qu'elle avait enregistré sur cet appareil. Les copies que tu as exportées et enregistrées ailleurs ne sont pas supprimées.",
    changesTitle: "Modifications",
    changes:
      "Si une future version modifie la façon dont tes données sont traitées (par exemple, pour les synchroniser entre appareils), ce sera expliqué ici au préalable.",
    contactTitle: "Contact",
    contact: "Questions sur la confidentialité",
    licenseTitle: "Licence",
    rightsReserved: "Tous droits réservés.",
    thirdParty: "Logiciels tiers",
    imagesTitle: "Images des exercices",
    images:
      "Les images des exercices sont générées par intelligence artificielle (OpenAI).",
    lastUpdated: "Dernière mise à jour",
  },
};
