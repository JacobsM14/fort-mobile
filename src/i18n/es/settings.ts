import type {
  AccentColor,
  Gender,
  LanguagePreference,
  ThemePreference,
} from "@/constants/enums";
import type { BackupErrorCode } from "@/features/data/backup";

export const settingsTexts = {
  settings: {
    breadCrumb: "Perfil",
    title: "Ajustes",
    appearance: "Apariencia",
    themeOptions: {
      system: "Sistema",
      light: "Claro",
      dark: "Oscuro",
    } satisfies Record<ThemePreference, string>,
    language: "Idioma",
    closeLanguage: "Cerrar idiomas",
    // Each language in its own name, so it can be found from any of them.
    languageOptions: {
      system: "Sistema",
      es: "Español",
      en: "English",
      ca: "Català",
      eu: "Euskara",
      fr: "Français",
      pt: "Português",
    } satisfies Record<LanguagePreference, string>,
    units: {
      weight: "Peso",
      distance: "Distancia",
      system: "Auto",
    },
    user: {
      height: "Altura",
      cm: "cm",
      feet: "ft",
      inches: "in",
      birthDate: "Fecha de nacimiento",
      day: "DD",
      month: "MM",
      year: "AAAA",
      intro:
        "Para un mejor cálculo de tu IMC, completa tu altura y fecha de nacimiento. La altura es obligatoria para calcular el IMC, pero la edad también puede influir en el resultado.",
      invalidDate: "Esa fecha no existe o aún no ha llegado.",
      gender: "Género",
      genders: {
        female: "Mujer",
        male: "Hombre",
        other: "Otro / Prefiero no decirlo",
      } satisfies Record<Gender, string>,
    },
    data: {
      export: {
        title: "Exportar datos",
        description:
          "Guarda una copia de tus datos en un archivo. Incluye tu perfil, así que guárdalo en un lugar seguro.",
        button: "Exportar",
        error: "No se han podido exportar los datos. Inténtalo de nuevo.",
      },
      import: {
        title: "Importar datos",
        description:
          "Recupera una copia exportada antes. Se combina con tus datos y no se borra nada.",
        button: "Elegir archivo",
        confirmTitle: "Importar este archivo",
        confirmMessage: (counts: {
          workouts: number;
          routines: number;
          exercises: number;
          bodyWeights: number;
        }) =>
          `El archivo trae:\nEntrenamientos: ${counts.workouts}\nRutinas: ${counts.routines}\nEjercicios propios: ${counts.exercises}\nPesos corporales: ${counts.bodyWeights}\n\nSe combinará con tus datos y no se borrará nada.`,
        confirm: "Importar",
        cancel: "Cancelar",
        done: (counts: {
          workouts: number;
          routines: number;
          exercises: number;
          bodyWeights: number;
          details: number;
        }) => {
          const items =
            counts.workouts +
            counts.routines +
            counts.exercises +
            counts.bodyWeights;
          if (items > 0) {
            return `Importado. Entrenamientos: ${counts.workouts}, rutinas: ${counts.routines}, ejercicios propios: ${counts.exercises}, pesos: ${counts.bodyWeights}.`;
          }
          return counts.details > 0
            ? "Se han actualizado ejercicios o series de rutinas y entrenamientos que ya tenías."
            : "No había nada nuevo que importar.";
        },
        skipped: (count: number) =>
          `Ejercicios sin importar por no existir en esta versión: ${count}.`,
        errors: {
          not_a_backup: "Ese archivo no es una copia de esta app.",
          unsupported_version:
            "Esa copia es de una versión más nueva de la app. Actualiza la app para poder importarla.",
          invalid:
            "Ese archivo está dañado o incompleto. No se ha importado nada.",
          failed:
            "No se han podido importar los datos. No se ha cambiado nada.",
        } satisfies Record<BackupErrorCode | "failed", string>,
      },
    },
    sections: {
      user: "Usuario",
      privacy: "Política de privacidad y licencias",
      notifications: "Notificaciones",
      data: "Exportar / Importar",
      preferences: "Preferencias",
      exercises: "Gestión de ejercicios",
      about: "Acerca de",
    },
    accent: {
      label: "Color",
      names: {
        orange: "Naranja",
        blue: "Azul",
        green: "Verde",
        purple: "Morado",
        pink: "Rosa",
        amber: "Ámbar",
      } satisfies Record<AccentColor, string>,
    },
    notifications: {
      enabled: "Recibir notificaciones",
      enabledDescription: "Apágalas para no recibir ninguna",
      blocked:
        "Las notificaciones de la app están bloqueadas en los ajustes del móvil.",
      openSystemSettings: "Abrir ajustes del móvil",
      types: "Qué notificaciones recibir",
      workout: "Entrenamiento en curso",
      workoutDescription: "El ejercicio en el que estás y el tiempo que llevas",
      weightReminder: "Recordatorio de pesaje",
      weightReminderDescription:
        "Un aviso a la semana para pesarte. Si ese día ya te has pesado, no suena.",
      day: "Día",
      time: "Hora",
      hourEarlier: "Una hora antes",
      hourLater: "Una hora después",
      minutesEarlier: (minutes: number) => `${minutes} minutos antes`,
      minutesLater: (minutes: number) => `${minutes} minutos después`,
    },
  },
  about: {
    version: "Versión",
    contact: "Contacto",
    rate: "Valorar la app",
    disclaimer: (appName: string) =>
      `${appName} no es un dispositivo médico y no diagnostica, trata, cura ni previene ninguna enfermedad. Consulta con un profesional sanitario antes de empezar un programa de ejercicio.`,
  },
  privacy: {
    summary: (appName: string) =>
      `${appName} guarda todo lo que registras solo en este dispositivo. No hay cuentas, servidores, anuncios ni analíticas.`,
    storedTitle: "Qué se guarda",
    storedIntro: "En la base de datos de la app, dentro de este dispositivo:",
    stored: [
      "Tus rutinas y los ejercicios que añades",
      "Tus entrenamientos, series y pesos",
      "Tu peso corporal, si lo registras",
      "Tus preferencias: apariencia, unidades, idioma y notificaciones, con el día y la hora del recordatorio de pesaje",
    ],
    security:
      "Estos datos están en el almacenamiento privado de la app, al que el sistema no deja acceder a otras apps.",
    notDoneTitle: "Lo que no hace la app",
    notDone: [
      "Pedirte una cuenta o datos personales",
      "Enviar nada a internet",
      "Usar analíticas ni rastreo",
      "Mostrar anuncios",
    ],
    backupsTitle: "Copias de seguridad",
    backups:
      "Si tienes activadas las copias de seguridad del sistema (iCloud o Google), tus datos pueden incluirse en ellas, como los de cualquier otra app. Esas copias dependen de tu cuenta, no de esta app.",
    exports:
      "También puedes exportar tus datos desde Ajustes. Se crea un archivo con todo lo que registras, incluido tu perfil, y tú decides dónde guardarlo o a quién enviarlo. La app solo guarda la última copia exportada, en su almacenamiento privado. Al importar, la app lee únicamente el archivo que elijas.",
    deleteTitle: "Borrar tus datos",
    delete:
      "Desinstalar la app borra todo lo que tenía guardado en este dispositivo. Las copias que hayas exportado y guardado en otro sitio no se borran.",
    changesTitle: "Cambios",
    changes:
      "Si una versión futura cambia cómo se tratan tus datos (por ejemplo, para sincronizarlos entre dispositivos), se explicará aquí antes de que ocurra.",
    contactTitle: "Contacto",
    contact: "Dudas sobre privacidad",
    licenseTitle: "Licencia",
    rightsReserved: "Todos los derechos reservados.",
    thirdParty: "Software de terceros",
    imagesTitle: "Imágenes de ejercicios",
    images:
      "Las imágenes de los ejercicios están generadas con inteligencia artificial (OpenAI).",
    lastUpdated: "Última actualización",
  },
};
