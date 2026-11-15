import type { Translations } from "@/i18n/es";

export const settingsTexts: Pick<
  Translations,
  "settings" | "about" | "privacy"
> = {
  settings: {
    breadCrumb: "Perfil",
    title: "Definições",
    appearance: "Aspeto",
    themeOptions: {
      system: "Sistema",
      light: "Claro",
      dark: "Escuro",
    },
    language: "Idioma",
    closeLanguage: "Fechar idiomas",
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
      weight: "Peso",
      distance: "Distância",
      system: "Auto",
    },
    user: {
      height: "Altura",
      cm: "cm",
      feet: "ft",
      inches: "in",
      birthDate: "Data de nascimento",
      day: "DD",
      month: "MM",
      year: "AAAA",
      intro:
        "Para um cálculo mais preciso do teu IMC, indica a tua altura e a data de nascimento. A altura é obrigatória para calcular o IMC, mas a idade também pode influenciar o resultado.",
      invalidDate: "Essa data não existe ou ainda não chegou.",
      gender: "Género",
      genders: {
        female: "Mulher",
        male: "Homem",
        other: "Outro / Prefiro não dizer",
      },
    },
    data: {
      export: {
        title: "Exportar dados",
        description:
          "Guarda uma cópia dos teus dados num ficheiro. Inclui o teu perfil, por isso guarda-o num lugar seguro.",
        button: "Exportar",
        error: "Não foi possível exportar os dados. Tenta novamente.",
      },
      import: {
        title: "Importar dados",
        description:
          "Recupera uma cópia exportada anteriormente. É combinada com os teus dados e nada é apagado.",
        button: "Escolher ficheiro",
        confirmTitle: "Importar este ficheiro",
        confirmMessage: (counts) =>
          `O ficheiro contém:\nTreinos: ${counts.workouts}\nRotinas: ${counts.routines}\nExercícios personalizados: ${counts.exercises}\nPesagens: ${counts.bodyWeights}\n\nVai ser combinado com os teus dados e nada será apagado.`,
        confirm: "Importar",
        cancel: "Cancelar",
        done: (counts) => {
          const items =
            counts.workouts +
            counts.routines +
            counts.exercises +
            counts.bodyWeights;
          if (items > 0) {
            return `Importado. Treinos: ${counts.workouts}, rotinas: ${counts.routines}, exercícios personalizados: ${counts.exercises}, pesagens: ${counts.bodyWeights}.`;
          }
          return counts.details > 0
            ? "Foram atualizados exercícios ou séries de rotinas e treinos que já tinhas."
            : "Não havia nada de novo para importar.";
        },
        skipped: (count) =>
          `Exercícios não importados por não existirem nesta versão: ${count}.`,
        errors: {
          not_a_backup: "Esse ficheiro não é uma cópia desta app.",
          unsupported_version:
            "Essa cópia é de uma versão mais recente da app. Atualiza a app para a poderes importar.",
          invalid:
            "Esse ficheiro está danificado ou incompleto. Não foi importado nada.",
          failed: "Não foi possível importar os dados. Nada foi alterado.",
        },
      },
    },
    sections: {
      user: "Utilizador",
      privacy: "Política de privacidade e licenças",
      notifications: "Notificações",
      data: "Exportar / Importar",
      preferences: "Preferências",
      exercises: "Gerir exercícios",
      about: "Sobre",
    },
    accent: {
      label: "Cor",
      names: {
        orange: "Laranja",
        blue: "Azul",
        green: "Verde",
        purple: "Roxo",
        pink: "Rosa",
        amber: "Âmbar",
      },
    },
    notifications: {
      enabled: "Receber notificações",
      enabledDescription: "Desativa-as para não receberes nenhuma",
      blocked:
        "As notificações da app estão bloqueadas nas definições do telemóvel.",
      openSystemSettings: "Abrir definições do telemóvel",
      types: "Que notificações receber",
      workout: "Treino em curso",
      workoutDescription:
        "O exercício que estás a fazer e há quanto tempo estás a treinar",
      weightReminder: "Lembrete de pesagem",
      weightReminderDescription:
        "Um aviso por semana para te pesares. Se nesse dia já te pesaste, não toca.",
      day: "Dia",
      time: "Hora",
      hourEarlier: "Uma hora antes",
      hourLater: "Uma hora depois",
      minutesEarlier: (minutes) => `${minutes} minutos antes`,
      minutesLater: (minutes) => `${minutes} minutos depois`,
    },
  },
  about: {
    version: "Versão",
    contact: "Contacto",
    rate: "Avaliar a app",
    tutorial: "Ver o tutorial",
    disclaimer: (appName) =>
      `${appName} não é um dispositivo médico e não diagnostica, trata, cura nem previne nenhuma doença. Consulta um profissional de saúde antes de começares um programa de exercício.`,
  },
  privacy: {
    summary: (appName) =>
      `${appName} guarda tudo o que registas apenas neste dispositivo. Sem contas, servidores, anúncios nem análises de utilização.`,
    storedTitle: "O que é guardado",
    storedIntro: "Na base de dados da app, neste dispositivo:",
    stored: [
      "As tuas rotinas e os exercícios que adicionas",
      "Os teus treinos, séries e pesos",
      "O teu peso corporal, se o registares",
      "O teu perfil, se o preencheres: altura, data de nascimento e género",
      "As tuas preferências: aspeto, unidades e idioma",
    ],
    storedNotifications:
      "As tuas preferências de notificações, com o dia e a hora do lembrete de pesagem",
    security:
      "Estes dados ficam no armazenamento privado da app, ao qual o sistema não deixa outras apps aceder.",
    notDoneTitle: "O que a app não faz",
    notDone: [
      "Pedir-te uma conta ou dados pessoais obrigatórios",
      "Enviar nada para a internet",
      "Usar ferramentas de análise ou de rastreio",
      "Mostrar anúncios",
    ],
    backupsTitle: "Cópias de segurança",
    backups:
      "Se tiveres as cópias de segurança do sistema ativadas (iCloud ou Google), os teus dados podem ser incluídos nelas, como os de qualquer outra app. Essas cópias dependem da tua conta, não desta app.",
    exports:
      "Também podes exportar os teus dados a partir das Definições. É criado um ficheiro com tudo o que registas, incluindo o teu perfil, e és tu que decides onde o guardar ou a quem o enviar. A app guarda apenas a última cópia exportada, no seu armazenamento privado. Ao importar, a app lê apenas o ficheiro que escolheres.",
    deleteTitle: "Apagar os teus dados",
    delete:
      "Desinstalar a app apaga tudo o que tinha guardado neste dispositivo. As cópias que tenhas exportado e guardado noutro sítio não são apagadas.",
    changesTitle: "Alterações",
    changes:
      "Se uma versão futura mudar a forma como os teus dados são tratados (por exemplo, para os sincronizar entre dispositivos), isso será explicado aqui antes de acontecer.",
    contactTitle: "Contacto",
    contact: "Dúvidas sobre privacidade",
    licenseTitle: "Licença",
    rightsReserved: "Todos os direitos reservados.",
    thirdParty: "Software de terceiros",
    imagesTitle: "Imagens dos exercícios",
    images:
      "As imagens dos exercícios foram geradas com inteligência artificial (OpenAI).",
    lastUpdated: "Última atualização",
  },
};
