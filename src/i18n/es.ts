import type {
  AccentColor,
  Equipment,
  Gender,
  LanguagePreference,
  MuscleGroup,
  ThemePreference,
  TrackingType,
} from "@/constants/enums";
import type { ExerciseKey, MuscleId } from "@/features/exercises/catalog";
import type { BmiCategory } from "@/features/progress/bmi";
import type { ProgressRange } from "@/features/progress/ranges";

export const es = {
  tabs: {
    today: "Hoy",
    routines: "Rutinas",
    progress: "Progreso",
    profile: "Perfil",
  },
  today: {
    title: "¿Qué toca hoy?",
    emptyTitle: "Aún no tienes rutinas",
    emptyMessage:
      "Crea tu primera rutina y elígela cada día que vayas a entrenar.",
    emptyAction: "Crear mi primera rutina",
    howItWorks: "Cómo funciona",
    steps: [
      "Crea tus rutinas una sola vez",
      "Selecciona los ejercicios que quieras",
      "El día que toque, elige una y empieza",
    ],
    pickRoutine: "Elige una de tus rutinas",
    start: "Empezar",
    startRoutine: (name: string) => `Empezar ${name}`,
    manageRoutines: "Gestionar mis rutinas",
    inProgress: "En curso",
    continue: "Continuar",
    continueRoutine: (name: string) => `Continuar ${name}`,
    activeTitle: "Tienes un entrenamiento en curso",
    activeMessage: (current: string, next: string) =>
      `Se terminará ${current} con las series que hayas marcado y empezará ${next}.`,
    activeConfirm: "Terminar y empezar",
    cancel: "Cancelar",
    startError: "No se ha podido empezar el entrenamiento",
  },
  workout: {
    title: "Entrenamiento",
    breadCrumb: "Hoy",
    chooseExercise: (current: number, total: number) =>
      `Elegir ejercicio, ${current} de ${total}`,
    closeExercises: "Cerrar lista de ejercicios",
    exerciseDone: (name: string) => `${name}, hecho`,
    noExercises: "Añade un ejercicio extra para empezar",
    set: "Serie",
    reps: "Reps",
    time: "Tiempo",
    completeSet: (set: number) => `Serie ${set} hecha`,
    previousSetFirst: "Marca antes la serie anterior",
    previous: "Antes",
    deleteSet: (set: number) => `Borrar la serie ${set}`,
    sets: "Series",
    deleteSetTitle: (set: number) => `¿Borrar la serie ${set}?`,
    deleteSetMessage:
      "Se borrará con su descanso. Esta acción no se puede deshacer.",
    deleteSetConfirm: "Borrar",
    cancel: "Cancelar",
    deleteSetError: "No se ha podido borrar la serie",
    start: "Iniciar",
    resume: "Reanudar",
    pause: "Pausar",
    stop: "Parar",
    reset: "Reiniciar",
    paused: "En pausa",
    resetTitle: "¿Reiniciar el cronómetro?",
    resetMessage: (time: string) =>
      `Se perderán ${time} sin guardar ninguna serie.`,
    resetConfirm: "Reiniciar",
    timeRest: "Cronometrar descanso",
    noRest: "Hacer de seguido",
    stopRest: "Parar",
    elapsed: "Duración del entrenamiento",
    rest: (time: string) => `Descanso ${time}`,
    addSet: "Añadir serie",
    extraExercise: "Ejercicio extra",
    addExercises: (count: number) =>
      count === 0 ? "Añadir" : `Añadir · ${count}`,
    finish: "Terminar rutina",
    finishTitle: "¿Terminar el entrenamiento?",
    finishMessage:
      "Se guardarán las series que has marcado. Las que no, se descartan.",
    finishEmptyMessage:
      "No has marcado ninguna serie, así que no se guardará nada.",
    finishConfirm: "Terminar",
    keepTraining: "Seguir entrenando",
    saveError: "No se ha podido guardar la serie",
    finishError: "No se ha podido terminar el entrenamiento",
    cancelTitle: "¿Cancelar el entrenamiento?",
    cancelMessage:
      "Se borrará todo lo que has registrado en él. Esta acción no se puede deshacer.",
    cancelConfirm: "Borrar entrenamiento",
    cancelError: "No se ha podido cancelar el entrenamiento",
  },
  finished: {
    title: "¡Has terminado!",
    subtitle: "Muy buen trabajo",
    duration: "Duración",
    exercises: "Ejercicios",
    sets: "Series",
    summary: "Resumen",
    seeProgress: "Ver más detalles en Progreso",
    close: "Cerrar",
  },
  progress: {
    inProgress: "En curso",
    reps: (count: number) => `${count} reps`,
    summary: (exercises: number, sets: number) =>
      `${exercises} ${exercises === 1 ? "ejercicio" : "ejercicios"} · ${sets} ${sets === 1 ? "serie" : "series"}`,
    strength: "Fuerza",
    bodyWeight: "Peso corporal",
    oneRepMaxNote:
      "1RM estimado: el peso máximo que podrías levantar una sola vez, calculado con la mejor serie del día (fórmula de Epley). Las series de más de 15 repeticiones cuentan como 15.",
    today: "Hoy",
    chooseExercise: (name: string) => `Elegir ejercicio, ${name}`,
    metrics: {
      weight_reps: "1RM estimado",
      bodyweight_reps: "Mejor serie",
      duration: "Mejor tiempo",
      distance_duration: "Velocidad",
    } satisfies Record<TrackingType, string>,
    speedUnit: { km: "km/h", mi: "mph" },
    chartSummary: (metric: string, first: string, last: string, days: number) =>
      `${metric}: de ${first} a ${last} en ${days} ${days === 1 ? "día" : "días"}`,
    chartHint: "Desliza arriba o abajo para cambiar de día",
    noData: "Sin datos en este periodo",
    noWeight: "No has guardado ningún peso aún.",
    noTrained: "Registra un entreno para ver aquí tu progreso",
    changeLabel: (change: string) => `Cambio en el periodo: ${change}`,
    oneRepMaxShort: "1RM est.",
    ranges: {
      "4w": { short: "4S", label: "4 semanas" },
      "3m": { short: "3M", label: "3 meses" },
      "6m": { short: "6M", label: "6 meses" },
      "1y": { short: "1A", label: "1 año" },
    } satisfies Record<ProgressRange, { short: string; label: string }>,
    registerWeight: "Registrar peso corporal",
    saveWeight: "Guardar peso corporal",
    weightSaved: "Peso guardado",
    saveWeightError: "No se ha podido guardar el peso",
    decreaseWeight: "Bajar peso",
    increaseWeight: "Subir peso",
    weightInput: "Peso corporal",
    oneWeightPerDay: "Solo puedes tener un registro de peso por día.",
    weightViews: { chart: "Gráfica", list: "Lista" },
    bmi: "Índice de masa corporal",
    bmiTitleEmpty: "Faltan datos para el IMC",
    bmiEmptyState:
      "Registra tu peso y completa los datos necesarios para consultar tu índice de masa corporal.",
    bmiEmptyAction: "Completar mis datos",
    bmiAssumedAdult:
      "Calculado como adulto. Si tienes menos de 19 años, añade tu fecha de nacimiento.",
    bmiNoReference:
      "La referencia de la OMS para menores de 19 años va por sexo, así que solo se muestra el valor.",
    bmiCategories: {
      underweight: "Bajo peso",
      normal: "Peso normal",
      overweight: "Sobrepeso",
      obese: "Obesidad",
    } satisfies Record<BmiCategory, string>,
    bmiBands: {
      underweight: "Bajo",
      normal: "Normal",
      overweight: "Sobrepeso",
      obese: "Obesidad",
    } satisfies Record<BmiCategory, string>,
    bmiToIdeal: {
      over: (weight: string) => `Te sobran ${weight} para tu peso ideal`,
      under: (weight: string) => `Te faltan ${weight} para tu peso ideal`,
      inRange: (weight: string) => `En tu peso ideal, a ${weight} del límite`,
    },
    bmiSummary: (score: string, category: string) =>
      `IMC ${score}: ${category}`,
  },
  history: {
    title: "Historial",
    day: "Día",
    exerciseCount: (count: number) =>
      `${count} ${count === 1 ? "ejercicio" : "ejercicios"}`,
    noWorkout: "Sin entreno",
    weight: "Peso",
    workouts: "Entrenos",
    noWeighIn: "Sin pesaje este día",
    logWeight: "Registrar",
    closeWeight: "Cerrar registro de peso",
    cancel: "Cancelar",
    deleteWeight: "Eliminar peso",
    deleteWeightTitle: "¿Eliminar el peso de este día?",
    deleteWeightMessage: (day: string) => `Se borrará el pesaje del ${day}.`,
    deleteWeightConfirm: "Eliminar",
    addExercise: "Añadir ejercicio",
    addRoutine: "Añadir rutina",
    chooseRoutine: "Elige la rutina que hiciste",
    logError: "No se ha podido añadir. Inténtalo de nuevo.",
    exerciseOptions: (name: string) => `Opciones de ${name}`,
    removeExercise: "Quitar ejercicio",
    closeMenu: "Cerrar menú",
    deleteExerciseTitle: (name: string) => `¿Quitar ${name}?`,
    deleteExerciseMessage: "Se borrarán todas sus series de este entreno.",
    deleteExerciseConfirm: "Quitar",
    deleteWorkout: "Eliminar entreno",
    deleteWorkoutTitle: "¿Eliminar el entreno?",
    deleteWorkoutMessage:
      "Se borrarán todos sus ejercicios y series. No se puede deshacer.",
    deleteWorkoutConfirm: "Eliminar",
    deleteError: "No se ha podido borrar. Inténtalo de nuevo.",
  },
  routines: {
    title: "Rutinas",
    subtitle: "Prepáralas una vez y elige la que toque cada día.",
    add: "Nueva rutina",
    noContent: "No hay rutinas todavía",
    exerciseCount: (count: number) =>
      `${count} ${count === 1 ? "ejercicio" : "ejercicios"}`,
  },
  newRoutine: {
    breadCrumb: "Cancelar",
    title1: "Nueva",
    title2: "Rutina",
    nameLabel: "Nombre",
    namePlaceholder: "Nombre de la rutina",
    exercisesLabel: "Ejercicios",
    addExercise: "Añadir ejercicio",
    removeExercise: "Quitar ejercicio",
    noContent: "Añade ejercicios para empezar",
    primaryButton: "Guardar rutina",
    saveError: "No se ha podido guardar la rutina",
  },
  editRoutine: {
    title1: "Editar",
    title2: "Rutina",
    primaryButton: "Guardar cambios",
    delete: "Eliminar rutina",
    deleteTitle: "¿Eliminar esta rutina?",
    deleteMessage:
      "Se borrará la rutina. Tus ejercicios y los entrenamientos que ya hiciste con ella se conservan.",
    deleteConfirm: "Eliminar",
    cancel: "Cancelar",
    deleteError: "No se ha podido eliminar la rutina",
  },
  newExercises: {
    breadCrumb: "Nueva rutina",
    breadCrumbEdit: "Editar rutina",
    title: "Ejercicios",
    searchPlaceholder: "Buscar ejercicio",
    clearSearch: "Borrar búsqueda",
    filters: "Filtros",
    clearFilters: "Limpiar",
    closeFilters: "Cerrar filtros",
    typeLabel: "Tipo",
    muscleLabel: "Músculo",
    showResults: (count: number) =>
      count === 1 ? "Ver 1 ejercicio" : `Ver ${count} ejercicios`,
    noResults: "No hay ejercicios que coincidan",
    createCustom: "Crear ejercicio propio",
    done: (count: number) =>
      `Listo · ${count} ${count === 1 ? "seleccionado" : "seleccionados"}`,
  },
  newCustomExercise: {
    breadCrumb: "Ejercicios",
    title1: "Nuevo",
    title2: "Ejercicio",
    primaryButton: "Crear ejercicio",
  },
  editExercise: {
    title1: "Editar",
    title2: "Ejercicio",
    primaryButton: "Guardar cambios",
    delete: "Eliminar ejercicio",
    deleteTitle: "¿Eliminar este ejercicio?",
    deleteMessage: (routineCount: number) =>
      routineCount === 0
        ? "Esta acción no se puede deshacer."
        : `Se quitará también de ${routineCount} ${routineCount === 1 ? "rutina" : "rutinas"}. Esta acción no se puede deshacer.`,
    deleteConfirm: "Eliminar",
    cancel: "Cancelar",
    deleteError: "No se ha podido eliminar el ejercicio",
  },
  exerciseForm: {
    nameLabel: "Nombre",
    trackingLabel: "Tipo de registro",
    musclesLabel: "Músculos principales",
    descriptionLabel: "Descripción",
  },
  manageExercises: {
    add: "Crear ejercicio",
    emptyTitle: "Aún no has creado ejercicios",
    emptyMessage:
      "Crea los que no estén en el catálogo y úsalos en tus rutinas como cualquier otro.",
  },
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
    // Each language in its own name, so it can be found from any of them.
    languageOptions: {
      system: "Sistema",
      es: "Español",
      en: "English",
    } satisfies Record<LanguagePreference, string>,
    units: {
      weight: "Peso",
      distance: "Distancia",
      system: "Sistema",
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
    sections: {
      user: "Usuario",
      privacy: "Política de privacidad y licencias",
      permissions: "Permisos",
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
      "Tus preferencias de apariencia (tema y color)",
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
    deleteTitle: "Borrar tus datos",
    delete:
      "Desinstalar la app borra todo lo que tenía guardado en este dispositivo.",
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
      "Las fotos de los ejercicios proceden del proyecto free-exercise-db.",
    lastUpdated: "Última actualización",
  },
  exercises: {
    namePlaceholder: "Nombre del ejercicio",
    descriptionPlaceholder: "Descripción (opcional)",
    saveError: "No se ha podido guardar el ejercicio",
    showInfo: "Ver información del ejercicio",
    noDescription: "Sin descripción",
    noImages: "Sin fotos",
    closeInfo: "Cerrar",
    equipmentLabel: "Material",
    enlargeImage: "Ampliar foto",
    closeImage: "Cerrar foto",
    trackingTypes: {
      weight_reps: "Peso + reps",
      bodyweight_reps: "Peso corporal",
      duration: "Duración",
      distance_duration: "Distancia",
    } satisfies Record<TrackingType, string>,
  },
  exerciseCatalog: {
    bench_press: {
      name: "Press de banca",
      description:
        "Tumbado en el banco, baja la barra al pecho y empuja hasta estirar los brazos.",
    },
    incline_bench_press: {
      name: "Press inclinado con barra",
      description:
        "En un banco inclinado, baja la barra a la parte alta del pecho y empuja hasta estirar los brazos.",
    },
    decline_bench_press: {
      name: "Press declinado con barra",
      description:
        "En un banco declinado, baja la barra a la parte baja del pecho y empuja hasta estirar los brazos.",
    },
    dumbbell_bench_press: {
      name: "Press de banca con mancuernas",
      description:
        "Tumbado en el banco, baja las mancuernas a los lados del pecho y empújalas hasta estirar los brazos.",
    },
    incline_dumbbell_press: {
      name: "Press inclinado con mancuernas",
      description:
        "En un banco inclinado, baja las mancuernas a los lados de la parte alta del pecho y empújalas hasta estirar los brazos.",
    },
    decline_dumbbell_press: {
      name: "Press declinado con mancuernas",
      description:
        "En un banco declinado, baja las mancuernas a los lados de la parte baja del pecho y empújalas hasta estirar los brazos.",
    },
    floor_press: {
      name: "Press en suelo con barra",
      description:
        "Tumbado en el suelo, baja la barra hasta que los codos toquen el suelo y empuja hasta estirar los brazos.",
    },
    dumbbell_floor_press: {
      name: "Press en suelo con mancuernas",
      description:
        "Tumbado en el suelo, baja las mancuernas hasta que los codos toquen el suelo y empújalas hasta estirar los brazos.",
    },
    smith_machine_bench_press: {
      name: "Press de banca en multipower",
      description:
        "Tumbado bajo la barra guiada del multipower, bájala al pecho y empuja hasta estirar los brazos.",
    },
    smith_machine_incline_press: {
      name: "Press inclinado en multipower",
      description:
        "En un banco inclinado bajo el multipower, baja la barra a la parte alta del pecho y empuja hasta estirar los brazos.",
    },
    machine_chest_press: {
      name: "Press de pecho en máquina",
      description:
        "Sentado con la espalda apoyada, empuja las asas hacia delante hasta estirar los brazos y vuelve con control.",
    },
    incline_machine_chest_press: {
      name: "Press de pecho inclinado en máquina",
      description:
        "Sentado en la máquina de press inclinado, empuja las asas hacia arriba y delante hasta estirar los brazos.",
    },
    cable_chest_press: {
      name: "Press de pecho en polea",
      description:
        "De pie de espaldas a las poleas, empuja las asas hacia delante hasta estirar los brazos y vuelve con control.",
    },
    dumbbell_fly: {
      name: "Aperturas con mancuernas",
      description:
        "Tumbado en el banco, abre los brazos con los codos ligeramente flexionados hasta notar el estiramiento y ciérralos sobre el pecho.",
    },
    incline_dumbbell_fly: {
      name: "Aperturas inclinadas con mancuernas",
      description:
        "En un banco inclinado, abre los brazos con los codos ligeramente flexionados y ciérralos sobre la parte alta del pecho.",
    },
    cable_fly: {
      name: "Aperturas en polea",
      description:
        "De pie entre dos poleas a la altura del pecho, junta las asas delante del cuerpo con los codos ligeramente flexionados.",
    },
    cable_crossover: {
      name: "Cruce de poleas",
      description:
        "De pie entre dos poleas altas, lleva las asas hacia abajo y al frente hasta cruzarlas delante del cuerpo.",
    },
    low_cable_crossover: {
      name: "Cruce de poleas bajo",
      description:
        "De pie entre dos poleas bajas, sube las asas en arco hasta juntarlas a la altura de la parte alta del pecho.",
    },
    pec_deck: {
      name: "Aperturas en máquina (contractora)",
      description:
        "Sentado con la espalda apoyada, junta los brazos delante del pecho y vuelve despacio a la posición inicial.",
    },
    dumbbell_pullover: {
      name: "Pullover con mancuerna",
      description:
        "Tumbado en el banco, lleva la mancuerna por detrás de la cabeza con los brazos casi rectos y vuelve hasta el pecho.",
    },
    svend_press: {
      name: "Press Svend",
      description:
        "De pie, sujeta un disco entre las palmas a la altura del pecho, estíralo al frente apretándolo con fuerza y vuelve.",
    },
    push_up: {
      name: "Flexiones",
      description:
        "En posición de plancha con las manos bajo los hombros, baja el pecho al suelo y empuja hasta estirar los brazos.",
    },
    incline_push_up: {
      name: "Flexiones inclinadas",
      description:
        "Con las manos sobre un banco o una superficie elevada, baja el pecho hacia ella y empuja hasta estirar los brazos.",
    },
    decline_push_up: {
      name: "Flexiones declinadas",
      description:
        "Con los pies sobre un banco y las manos en el suelo, baja el pecho hacia el suelo y empuja hasta estirar los brazos.",
    },
    knee_push_up: {
      name: "Flexiones de rodillas",
      description:
        "Apoyado en manos y rodillas con el cuerpo recto de rodillas a cabeza, baja el pecho al suelo y empuja hacia arriba.",
    },
    wide_push_up: {
      name: "Flexiones con agarre ancho",
      description:
        "Con las manos más separadas que los hombros, baja el pecho al suelo y empuja hasta estirar los brazos.",
    },
    diamond_push_up: {
      name: "Flexiones diamante",
      description:
        "Con las manos juntas bajo el pecho formando un rombo con pulgares e índices, baja el pecho hacia las manos y empuja hacia arriba.",
    },
    archer_push_up: {
      name: "Flexiones arquero",
      description:
        "Con las manos muy separadas, baja desplazando el peso hacia un brazo mientras el otro queda estirado y vuelve arriba.",
    },
    clap_push_up: {
      name: "Flexiones con palmada",
      description:
        "Baja el pecho al suelo y empuja con fuerza para despegar las manos, da una palmada en el aire y amortigua la caída.",
    },
    weighted_push_up: {
      name: "Flexiones con lastre",
      description:
        "Haz flexiones con un disco o una mochila con peso sobre la espalda, bajando el pecho al suelo y empujando hacia arriba.",
    },
    dip: {
      name: "Fondos en paralelas",
      description:
        "Sostenido en las barras paralelas, baja flexionando los codos hasta unos 90° y empuja hasta estirar los brazos.",
    },
    chest_dip: {
      name: "Fondos para pecho",
      description:
        "En las paralelas, inclina el torso hacia delante y baja hasta notar el estiramiento del pecho; empuja para subir.",
    },
    weighted_dip: {
      name: "Fondos con lastre",
      description:
        "Haz fondos en paralelas con un cinturón de lastre o una mancuerna entre los pies, bajando y subiendo con control.",
    },
    bench_dip: {
      name: "Fondos en banco",
      description:
        "Con las manos apoyadas en un banco detrás de ti y las piernas estiradas, baja flexionando los codos y empuja hacia arriba.",
    },
    assisted_dip: {
      name: "Fondos asistidos en máquina",
      description:
        "Apoyado en la plataforma de asistencia, baja flexionando los codos y empuja hasta estirar los brazos; el peso es la ayuda que recibes.",
    },
    machine_dip: {
      name: "Fondos en máquina",
      description:
        "Sentado en la máquina, empuja las asas hacia abajo hasta estirar los codos y vuelve con control.",
    },
    band_chest_press: {
      name: "Press de pecho con banda",
      description:
        "Con la banda rodeando la espalda y los extremos en las manos, empuja hacia delante hasta estirar los brazos y vuelve con control.",
    },
    // Shoulders
    overhead_press: {
      name: "Press militar",
      description:
        "De pie, empuja la barra desde los hombros hasta estirar los brazos sobre la cabeza y bájala con control.",
    },
    seated_overhead_press: {
      name: "Press militar sentado",
      description:
        "Sentado con la espalda recta, empuja la barra desde los hombros hasta estirar los brazos sobre la cabeza.",
    },
    push_press: {
      name: "Push press",
      description:
        "Con la barra sobre los hombros, flexiona ligeramente las rodillas y empuja con las piernas para lanzar la barra sobre la cabeza.",
    },
    behind_the_neck_press: {
      name: "Press tras nuca",
      description:
        "Sentado, baja la barra por detrás de la cabeza hasta las orejas y empuja hasta estirar los brazos; requiere buena movilidad de hombros.",
    },
    dumbbell_shoulder_press: {
      name: "Press de hombros con mancuernas",
      description:
        "Sentado con la espalda apoyada, empuja las mancuernas desde los hombros hasta estirar los brazos sobre la cabeza.",
    },
    standing_dumbbell_press: {
      name: "Press de hombros con mancuernas de pie",
      description:
        "De pie con el abdomen firme, empuja las mancuernas desde los hombros hasta estirar los brazos sobre la cabeza.",
    },
    arnold_press: {
      name: "Press Arnold",
      description:
        "Parte con las mancuernas frente al pecho y las palmas hacia ti; gira las muñecas mientras empujas hasta estirar los brazos sobre la cabeza.",
    },
    single_arm_dumbbell_press: {
      name: "Press de hombro con mancuerna a una mano",
      description:
        "De pie, empuja una mancuerna desde el hombro hasta estirar el brazo sobre la cabeza sin inclinar el torso.",
    },
    machine_shoulder_press: {
      name: "Press de hombros en máquina",
      description:
        "Sentado con la espalda apoyada, empuja las asas hacia arriba hasta estirar los brazos y baja con control.",
    },
    smith_machine_shoulder_press: {
      name: "Press de hombros en multipower",
      description:
        "Sentado bajo la barra guiada del multipower, empújala desde la altura de la barbilla hasta estirar los brazos.",
    },
    kettlebell_press: {
      name: "Press con kettlebell",
      description:
        "De pie con la kettlebell apoyada en el hombro, empújala sobre la cabeza hasta estirar el brazo y bájala con control.",
    },
    landmine_press: {
      name: "Press landmine",
      description:
        "De pie con el extremo de la barra anclado al suelo, empújalo hacia arriba y delante hasta estirar el brazo.",
    },
    band_shoulder_press: {
      name: "Press de hombros con banda",
      description:
        "Pisando la banda con los pies, empuja los extremos desde los hombros hasta estirar los brazos sobre la cabeza.",
    },
    lateral_raise: {
      name: "Elevaciones laterales con mancuernas",
      description:
        "De pie, sube las mancuernas hacia los lados hasta la altura de los hombros con los codos ligeramente flexionados.",
    },
    seated_lateral_raise: {
      name: "Elevaciones laterales sentado",
      description:
        "Sentado con la espalda recta, sube las mancuernas hacia los lados hasta la altura de los hombros y baja despacio.",
    },
    cable_lateral_raise: {
      name: "Elevaciones laterales en polea",
      description:
        "De pie de lado a la polea baja, sube el asa hacia el lado hasta la altura del hombro y baja con control.",
    },
    machine_lateral_raise: {
      name: "Elevaciones laterales en máquina",
      description:
        "Sentado en la máquina, sube los brazos hacia los lados contra las almohadillas hasta la altura de los hombros y vuelve despacio.",
    },
    band_lateral_raise: {
      name: "Elevaciones laterales con banda",
      description:
        "Pisando la banda con los pies, sube las manos hacia los lados hasta la altura de los hombros y baja con control.",
    },
    front_raise: {
      name: "Elevaciones frontales con mancuernas",
      description:
        "De pie, sube las mancuernas al frente hasta la altura de los hombros con los brazos casi estirados.",
    },
    barbell_front_raise: {
      name: "Elevaciones frontales con barra",
      description:
        "De pie con la barra delante de los muslos, súbela al frente hasta la altura de los hombros con los brazos casi estirados.",
    },
    plate_front_raise: {
      name: "Elevaciones frontales con disco",
      description:
        "Sujeta un disco con ambas manos y súbelo al frente hasta la altura de los ojos con los brazos casi estirados.",
    },
    cable_front_raise: {
      name: "Elevaciones frontales en polea",
      description:
        "De espaldas a la polea baja, sube el asa o la cuerda al frente hasta la altura de los hombros.",
    },
    pike_push_up: {
      name: "Flexiones en pica",
      description:
        "Con las caderas elevadas formando una V invertida, baja la cabeza hacia el suelo flexionando los codos y empuja hacia arriba.",
    },
    handstand_push_up: {
      name: "Flexiones en pino",
      description:
        "En posición invertida con los pies apoyados en la pared, baja la cabeza hacia el suelo y empuja hasta estirar los brazos.",
    },
    wall_handstand_hold: {
      name: "Pino en la pared",
      description:
        "En posición invertida con los pies apoyados en la pared y los brazos estirados, mantén la postura.",
    },
    // Rear delts and rotator cuff
    rear_delt_fly: {
      name: "Pájaros con mancuernas",
      description:
        "Con el torso inclinado hacia delante, abre los brazos hacia los lados hasta la altura de los hombros apretando los omóplatos.",
    },
    chest_supported_rear_delt_fly: {
      name: "Pájaros con mancuernas apoyado en banco",
      description:
        "Con el pecho apoyado en un banco inclinado, abre los brazos hacia los lados apretando los omóplatos y baja despacio.",
    },
    reverse_pec_deck: {
      name: "Pájaros en máquina (contractora inversa)",
      description:
        "Sentado de cara al respaldo, abre los brazos hacia atrás hasta alinearlos con los hombros y vuelve despacio.",
    },
    cable_rear_delt_fly: {
      name: "Pájaros en polea",
      description:
        "De pie entre dos poleas, agarra con cada mano el asa contraria y abre los brazos hacia los lados y atrás.",
    },
    face_pull: {
      name: "Face pull",
      description:
        "Con la cuerda en la polea alta, tira hacia la cara abriendo los codos y rotando los hombros hacia fuera.",
    },
    band_face_pull: {
      name: "Face pull con banda",
      description:
        "Con la banda anclada a la altura de la cara, tira hacia ti abriendo los codos hasta llevar las manos junto a las orejas.",
    },
    band_pull_apart: {
      name: "Separación de banda (pull-apart)",
      description:
        "Con los brazos estirados al frente, separa las manos estirando la banda hasta abrir el pecho y vuelve con control.",
    },
    dumbbell_external_rotation: {
      name: "Rotación externa con mancuerna",
      description:
        "Tumbado de lado con el codo pegado al cuerpo y flexionado a 90°, gira el antebrazo hacia arriba sin separar el codo.",
    },
    cable_external_rotation: {
      name: "Rotación externa en polea",
      description:
        "De pie de lado a la polea con el codo pegado al cuerpo y flexionado a 90°, gira el antebrazo hacia fuera y vuelve despacio.",
    },
    band_external_rotation: {
      name: "Rotación externa con banda",
      description:
        "Con el codo pegado al cuerpo y flexionado a 90° y la banda anclada a un lado, gira el antebrazo hacia fuera y vuelve despacio.",
    },
    // Traps
    upright_row: {
      name: "Remo al mentón con barra",
      description:
        "De pie, sube la barra pegada al cuerpo hasta el pecho llevando los codos por encima de las manos.",
    },
    dumbbell_upright_row: {
      name: "Remo al mentón con mancuernas",
      description:
        "De pie, sube las mancuernas pegadas al cuerpo hasta el pecho llevando los codos por encima de las manos.",
    },
    cable_upright_row: {
      name: "Remo al mentón en polea",
      description:
        "De pie frente a la polea baja, sube la barra pegada al cuerpo hasta el pecho llevando los codos por encima de las manos.",
    },
    barbell_shrug: {
      name: "Encogimientos con barra",
      description:
        "De pie con la barra colgando delante, sube los hombros hacia las orejas, mantén un instante y baja.",
    },
    dumbbell_shrug: {
      name: "Encogimientos con mancuernas",
      description:
        "De pie con una mancuerna en cada mano, sube los hombros hacia las orejas, mantén un instante y baja.",
    },
    trap_bar_shrug: {
      name: "Encogimientos con barra hexagonal",
      description:
        "De pie dentro de la barra hexagonal, sube los hombros hacia las orejas, mantén un instante y baja.",
    },
    // Back: pull-ups and pulldowns
    pull_up: {
      name: "Dominadas",
      description:
        "Colgado de la barra con agarre prono algo más ancho que los hombros, sube hasta pasar la barbilla por encima de la barra y baja con control.",
    },
    chin_up: {
      name: "Dominadas supinas",
      description:
        "Colgado de la barra con agarre supino a la anchura de los hombros, sube hasta pasar la barbilla por encima de la barra y baja con control.",
    },
    neutral_grip_pull_up: {
      name: "Dominadas con agarre neutro",
      description:
        "Colgado de asas paralelas con las palmas enfrentadas, sube hasta que la barbilla supere las asas y baja con control.",
    },
    wide_grip_pull_up: {
      name: "Dominadas con agarre ancho",
      description:
        "Colgado de la barra con las manos mucho más abiertas que los hombros, sube llevando el pecho hacia la barra y baja despacio.",
    },
    weighted_pull_up: {
      name: "Dominadas lastradas",
      description:
        "Haz dominadas con un cinturón de lastre o una mancuerna entre los pies, subiendo hasta pasar la barbilla por encima de la barra.",
    },
    weighted_chin_up: {
      name: "Dominadas supinas lastradas",
      description:
        "Haz dominadas con agarre supino y un cinturón de lastre o una mancuerna entre los pies, subiendo hasta pasar la barbilla por encima de la barra.",
    },
    assisted_pull_up: {
      name: "Dominadas asistidas en máquina",
      description:
        "Apoyado en la plataforma de asistencia, sube hasta pasar la barbilla por encima de la barra y baja despacio; el peso es la ayuda que recibes.",
    },
    negative_pull_up: {
      name: "Dominadas negativas",
      description:
        "Salta o sube con ayuda hasta tener la barbilla sobre la barra y baja lo más despacio posible hasta estirar los brazos.",
    },
    dead_hang: {
      name: "Colgarse de la barra",
      description:
        "Cuelga de una barra con los brazos estirados y los hombros activos durante el mayor tiempo posible.",
    },
    lat_pulldown: {
      name: "Jalón al pecho",
      description:
        "Sentado frente a la polea alta, tira de la barra ancha hasta la parte alta del pecho y vuelve arriba con control.",
    },
    neutral_grip_lat_pulldown: {
      name: "Jalón con agarre neutro",
      description:
        "Sentado frente a la polea alta con el agarre en V, tira del asa hasta el pecho y vuelve arriba despacio.",
    },
    reverse_grip_lat_pulldown: {
      name: "Jalón con agarre supino",
      description:
        "Sentado frente a la polea alta con las palmas hacia ti, tira de la barra hasta la parte alta del pecho y vuelve arriba con control.",
    },
    single_arm_lat_pulldown: {
      name: "Jalón a una mano",
      description:
        "Sentado frente a la polea alta, tira del asa con un solo brazo hasta el costado del pecho y vuelve arriba despacio.",
    },
    straight_arm_pulldown: {
      name: "Pullover en polea con brazos rectos",
      description:
        "De pie frente a la polea alta, baja la barra o la cuerda hasta los muslos con los brazos casi estirados.",
    },
    machine_pullover: {
      name: "Pullover en máquina",
      description:
        "Sentado en la máquina, lleva los codos desde arriba hacia el abdomen y vuelve con control.",
    },
    band_pulldown: {
      name: "Jalón con banda elástica",
      description:
        "Con la banda anclada en alto, tira hacia abajo con los brazos casi estirados hasta llevar las manos a los muslos.",
    },
    // Back: rows
    barbell_row: {
      name: "Remo con barra",
      description:
        "Con el torso inclinado y la espalda recta, tira de la barra hacia el abdomen y bájala con control.",
    },
    pendlay_row: {
      name: "Remo Pendlay",
      description:
        "Con el torso paralelo al suelo, tira de la barra hacia el abdomen y devuélvela al suelo en cada repetición.",
    },
    underhand_barbell_row: {
      name: "Remo con barra agarre supino",
      description:
        "Con el torso inclinado y las palmas hacia arriba, tira de la barra hacia la parte baja del abdomen y baja con control.",
    },
    t_bar_row: {
      name: "Remo en T",
      description:
        "Con el torso inclinado sobre la barra anclada, tira del asa hacia el pecho y baja con control.",
    },
    chest_supported_t_bar_row: {
      name: "Remo en T con apoyo en el pecho",
      description:
        "Con el pecho apoyado en el soporte, tira de las asas hacia el torso juntando los omóplatos y baja con control.",
    },
    seal_row: {
      name: "Remo foca",
      description:
        "Tumbado boca abajo en un banco elevado, tira de la barra hacia el torso y bájala hasta estirar los brazos.",
    },
    dumbbell_row: {
      name: "Remo con mancuerna a una mano",
      description:
        "Apoyado con una mano y una rodilla en el banco, tira de la mancuerna hacia la cadera y baja con control.",
    },
    chest_supported_dumbbell_row: {
      name: "Remo con mancuernas apoyado en banco inclinado",
      description:
        "Tumbado boca abajo en un banco inclinado, tira de las mancuernas hacia las costillas juntando los omóplatos.",
    },
    bent_over_dumbbell_row: {
      name: "Remo inclinado con mancuernas",
      description:
        "Con el torso inclinado y la espalda recta, tira de las dos mancuernas hacia las caderas y baja con control.",
    },
    meadows_row: {
      name: "Remo Meadows",
      description:
        "De pie de lado a una barra anclada (landmine), inclina el torso y tira del extremo de la barra hacia la cadera.",
    },
    seated_cable_row: {
      name: "Remo sentado en polea",
      description:
        "Sentado con las rodillas ligeramente flexionadas, tira del asa hacia el abdomen con la espalda recta y vuelve con control.",
    },
    wide_grip_seated_row: {
      name: "Remo sentado en polea con agarre ancho",
      description:
        "Sentado frente a la polea baja con una barra ancha, tira hacia la parte media del pecho abriendo los codos.",
    },
    single_arm_cable_row: {
      name: "Remo en polea a una mano",
      description:
        "Sentado o de pie frente a la polea, tira del asa hacia la cadera con un solo brazo y vuelve con control.",
    },
    machine_row: {
      name: "Remo en máquina",
      description:
        "Sentado con el pecho apoyado, tira de las asas hacia el torso juntando los omóplatos y vuelve despacio.",
    },
    machine_high_row: {
      name: "Remo alto en máquina",
      description:
        "Sentado en la máquina de remo alto, tira de las asas hacia abajo y atrás hasta pegar los codos al torso.",
    },
    inverted_row: {
      name: "Remo invertido",
      description:
        "Tumbado bajo una barra baja con el cuerpo recto, tira del pecho hacia la barra y baja con control.",
    },
    suspension_row: {
      name: "Remo con suspensión (TRX)",
      description:
        "Inclinado hacia atrás sujetando las asas de suspensión, tira del pecho hacia las manos y baja con control.",
    },
    kettlebell_row: {
      name: "Remo con kettlebell",
      description:
        "Con el torso inclinado y una mano apoyada, tira de la kettlebell hacia la cadera y baja con control.",
    },
    renegade_row: {
      name: "Remo renegado",
      description:
        "En posición de plancha sobre dos mancuernas, tira de una hacia la cadera sin girar el torso y alterna los lados.",
    },
    band_row: {
      name: "Remo con banda elástica",
      description:
        "Sentado con la banda alrededor de los pies, tira de los extremos hacia el abdomen juntando los omóplatos.",
    },
    // Posterior chain and lower back
    deadlift: {
      name: "Peso muerto",
      description:
        "Con la barra a los pies, extiende cadera y rodillas manteniendo la espalda recta hasta ponerte de pie y baja con control.",
    },
    sumo_deadlift: {
      name: "Peso muerto sumo",
      description:
        "Con los pies muy separados y las manos agarrando por dentro de las piernas, levanta la barra extendiendo cadera y rodillas.",
    },
    romanian_deadlift: {
      name: "Peso muerto rumano",
      description:
        "De pie con la barra en las manos, lleva la cadera atrás con las rodillas casi estiradas hasta notar el estiramiento de los isquios y vuelve.",
    },
    stiff_leg_deadlift: {
      name: "Peso muerto con piernas rígidas",
      description:
        "Con las piernas casi rectas, inclina el torso bajando la barra hacia los pies y vuelve arriba extendiendo la cadera.",
    },
    trap_bar_deadlift: {
      name: "Peso muerto con barra hexagonal",
      description:
        "Dentro de la barra hexagonal, empuja el suelo con los pies y extiende cadera y rodillas hasta ponerte de pie.",
    },
    dumbbell_romanian_deadlift: {
      name: "Peso muerto rumano con mancuernas",
      description:
        "De pie con una mancuerna en cada mano, lleva la cadera atrás con las rodillas casi estiradas y vuelve apretando los glúteos.",
    },
    single_leg_romanian_deadlift: {
      name: "Peso muerto rumano a una pierna",
      description:
        "Apoyado en una pierna, inclina el torso llevando la otra pierna atrás y baja las mancuernas hacia el suelo antes de volver.",
    },
    kettlebell_deadlift: {
      name: "Peso muerto con kettlebell",
      description:
        "Con la kettlebell entre los pies, flexiona la cadera, agarra el asa y levántala extendiendo cadera y rodillas.",
    },
    rack_pull: {
      name: "Rack pull",
      description:
        "Con la barra a la altura de las rodillas en el rack, extiende la cadera hasta ponerte de pie y baja con control.",
    },
    good_morning: {
      name: "Buenos días",
      description:
        "Con la barra sobre los trapecios, inclina el torso hacia delante llevando la cadera atrás y vuelve a la posición erguida.",
    },
    back_extension: {
      name: "Extensiones lumbares en banco romano",
      description:
        "En el banco de hiperextensiones, baja el torso desde la cadera y sube hasta alinear el cuerpo.",
    },
    weighted_back_extension: {
      name: "Extensiones lumbares con peso",
      description:
        "En el banco de hiperextensiones con un disco contra el pecho, baja el torso desde la cadera y sube hasta alinear el cuerpo.",
    },
    reverse_hyperextension: {
      name: "Hiperextensión inversa",
      description:
        "Tumbado boca abajo sobre la máquina, eleva las piernas hacia atrás hasta alinearlas con el torso y baja con control.",
    },
    superman: {
      name: "Superman",
      description:
        "Tumbado boca abajo, eleva a la vez brazos y piernas del suelo, mantén un instante y baja.",
    },
    bird_dog: {
      name: "Bird dog",
      description:
        "A cuatro apoyos, extiende un brazo y la pierna contraria manteniendo la espalda neutra y alterna los lados.",
    },
    // Biceps
    barbell_curl: {
      name: "Curl con barra",
      description:
        "De pie con la barra en agarre supino, flexiona los codos para subirla hasta los hombros y baja con control.",
    },
    ez_bar_curl: {
      name: "Curl con barra Z",
      description:
        "De pie con la barra Z, flexiona los codos para subirla hasta los hombros sin balancear el cuerpo.",
    },
    preacher_curl: {
      name: "Curl predicador con barra Z",
      description:
        "Con los brazos apoyados en el banco Scott, baja la barra hasta casi estirar los codos y sube contrayendo el bíceps.",
    },
    machine_preacher_curl: {
      name: "Curl predicador en máquina",
      description:
        "Sentado con los brazos apoyados en el cojín, flexiona los codos para subir las asas y baja despacio.",
    },
    dumbbell_curl: {
      name: "Curl con mancuernas",
      description:
        "De pie con una mancuerna en cada mano, flexiona los codos girando las palmas hacia arriba y baja con control.",
    },
    incline_dumbbell_curl: {
      name: "Curl inclinado con mancuernas",
      description:
        "Sentado en un banco inclinado con los brazos colgando, flexiona los codos para subir las mancuernas y baja despacio.",
    },
    hammer_curl: {
      name: "Curl martillo",
      description:
        "De pie con las palmas enfrentadas, flexiona los codos subiendo las mancuernas sin girar las muñecas y baja con control.",
    },
    cross_body_hammer_curl: {
      name: "Curl martillo cruzado",
      description:
        "Con las palmas enfrentadas, sube cada mancuerna hacia el hombro contrario cruzando el pecho y baja con control.",
    },
    concentration_curl: {
      name: "Curl concentrado",
      description:
        "Sentado con el codo apoyado en el muslo, flexiona el brazo para subir la mancuerna al hombro y baja despacio.",
    },
    spider_curl: {
      name: "Curl araña",
      description:
        "Tumbado boca abajo en un banco inclinado con los brazos colgando, sube las mancuernas flexionando los codos.",
    },
    zottman_curl: {
      name: "Curl Zottman",
      description:
        "Sube las mancuernas con las palmas hacia arriba, gíralas arriba hacia abajo y baja despacio con agarre prono.",
    },
    cable_curl: {
      name: "Curl en polea baja",
      description:
        "De pie frente a la polea baja, sube la barra o el asa flexionando los codos y baja sin perder la tensión.",
    },
    rope_hammer_curl: {
      name: "Curl martillo con cuerda",
      description:
        "De pie frente a la polea baja con la cuerda, flexiona los codos con las palmas enfrentadas y baja con control.",
    },
    high_cable_curl: {
      name: "Curl en polea alta",
      description:
        "De pie entre dos poleas altas con los brazos abiertos, flexiona los codos llevando las asas hacia la cabeza.",
    },
    bayesian_curl: {
      name: "Curl bayesiano en polea",
      description:
        "De espaldas a la polea baja con el brazo estirado hacia atrás, flexiona el codo llevando el asa hacia el hombro y baja con control.",
    },
    drag_curl: {
      name: "Curl arrastrado con barra",
      description:
        "Sube la barra pegada al cuerpo llevando los codos hacia atrás, sin separarla del torso, y baja con control.",
    },
    band_curl: {
      name: "Curl con banda elástica",
      description:
        "Pisando la banda con los pies, flexiona los codos para subir las manos hasta los hombros y baja con control.",
    },
    // Forearms and grip
    reverse_curl: {
      name: "Curl inverso",
      description:
        "De pie con agarre prono, flexiona los codos para subir la barra hasta los hombros y baja con control.",
    },
    wrist_curl: {
      name: "Curl de muñeca",
      description:
        "Con los antebrazos apoyados en un banco y las palmas hacia arriba, flexiona las muñecas para subir la barra y baja despacio.",
    },
    reverse_wrist_curl: {
      name: "Extensión de muñeca",
      description:
        "Con los antebrazos apoyados y las palmas hacia abajo, sube el dorso de las manos extendiendo las muñecas y baja despacio.",
    },
    plate_pinch: {
      name: "Pinza con discos",
      description:
        "Sujeta dos discos lisos juntos entre los dedos y el pulgar y mantén el agarre el mayor tiempo posible.",
    },
    farmer_walk: {
      name: "Paseo del granjero",
      description:
        "Camina con una mancuerna pesada en cada mano, con el torso erguido y los hombros firmes.",
    },
    suitcase_carry: {
      name: "Marcha de maleta",
      description:
        "Camina con una mancuerna pesada en una sola mano sin inclinar el torso hacia ningún lado.",
    },
    // Triceps
    triceps_pushdown: {
      name: "Extensión de tríceps en polea",
      description:
        "De pie frente a la polea alta con la barra, empuja hacia abajo hasta estirar los codos manteniéndolos pegados al cuerpo.",
    },
    rope_pushdown: {
      name: "Extensión de tríceps con cuerda",
      description:
        "De pie frente a la polea alta con la cuerda, estira los codos y separa los extremos de la cuerda al final del movimiento.",
    },
    reverse_grip_pushdown: {
      name: "Extensión de tríceps en polea con agarre supino",
      description:
        "Con la barra y las palmas hacia arriba, empuja hacia abajo hasta estirar los codos pegados al cuerpo.",
    },
    single_arm_pushdown: {
      name: "Extensión de tríceps en polea a una mano",
      description:
        "De pie frente a la polea alta con un asa, empuja hacia abajo con un solo brazo hasta estirar el codo y vuelve con control.",
    },
    overhead_cable_triceps_extension: {
      name: "Extensión de tríceps sobre la cabeza en polea",
      description:
        "De espaldas a la polea con la cuerda detrás de la cabeza, estira los codos hacia delante y arriba y vuelve con control.",
    },
    overhead_dumbbell_triceps_extension: {
      name: "Extensión de tríceps con mancuerna sobre la cabeza",
      description:
        "Con una mancuerna sujeta a dos manos por detrás de la cabeza, estira los codos hasta extender los brazos y baja despacio.",
    },
    skull_crusher: {
      name: "Press francés",
      description:
        "Tumbado en el banco con la barra Z sobre el pecho, flexiona los codos bajándola hacia la frente y estira para volver.",
    },
    dumbbell_skull_crusher: {
      name: "Press francés con mancuernas",
      description:
        "Tumbado en el banco con las mancuernas sobre el pecho, flexiona los codos bajándolas hacia la cabeza y estira para volver.",
    },
    close_grip_bench_press: {
      name: "Press de banca con agarre cerrado",
      description:
        "Tumbado en el banco, baja la barra al pecho con las manos a la anchura de los hombros y empuja hasta estirar los codos.",
    },
    jm_press: {
      name: "Press JM",
      description:
        "Tumbado en el banco, baja la barra hacia la barbilla flexionando los codos hacia delante y empuja hacia arriba.",
    },
    dumbbell_kickback: {
      name: "Patada de tríceps con mancuerna",
      description:
        "Con el torso inclinado y el codo pegado al cuerpo, estira el brazo hacia atrás hasta extenderlo y vuelve.",
    },
    cable_kickback: {
      name: "Patada de tríceps en polea",
      description:
        "Con el torso inclinado y el codo pegado al cuerpo, estira el brazo hacia atrás contra la polea baja y vuelve con control.",
    },
    machine_triceps_extension: {
      name: "Extensión de tríceps en máquina",
      description:
        "Sentado en la máquina, estira los codos empujando las asas o la barra hacia abajo y vuelve despacio.",
    },
    band_pushdown: {
      name: "Extensión de tríceps con banda",
      description:
        "Con la banda anclada en alto, empuja hacia abajo hasta estirar los codos pegados al cuerpo y vuelve con control.",
    },
    // Quads and squats
    back_squat: {
      name: "Sentadilla trasera",
      description:
        "Con la barra sobre los trapecios, baja flexionando cadera y rodillas hasta la profundidad deseada y sube empujando el suelo.",
    },
    front_squat: {
      name: "Sentadilla frontal",
      description:
        "Con la barra apoyada en la parte delantera de los hombros y los codos altos, baja con el torso erguido y sube empujando el suelo.",
    },
    box_squat: {
      name: "Sentadilla al cajón",
      description:
        "Con la barra a la espalda, baja hasta sentarte con control sobre un cajón y sube empujando el suelo.",
    },
    zercher_squat: {
      name: "Sentadilla Zercher",
      description:
        "Con la barra apoyada en el pliegue de los codos, baja con el torso erguido hasta la profundidad deseada y sube.",
    },
    overhead_squat: {
      name: "Sentadilla con barra sobre la cabeza",
      description:
        "Con la barra sostenida sobre la cabeza con los brazos estirados, baja en sentadilla con el torso erguido y sube.",
    },
    goblet_squat: {
      name: "Sentadilla goblet",
      description:
        "Sujetando una mancuerna contra el pecho con ambas manos, baja con el torso erguido hasta la profundidad deseada y sube.",
    },
    dumbbell_squat: {
      name: "Sentadilla con mancuernas",
      description:
        "Con una mancuerna en cada mano a los lados, baja flexionando cadera y rodillas y sube empujando el suelo.",
    },
    bodyweight_squat: {
      name: "Sentadilla con peso corporal",
      description:
        "De pie con los pies a la anchura de los hombros, baja flexionando cadera y rodillas y vuelve a subir.",
    },
    band_squat: {
      name: "Sentadilla con banda",
      description:
        "Pisando la banda con los pies y sujetando los extremos a la altura de los hombros, baja en sentadilla y sube empujando el suelo.",
    },
    jump_squat: {
      name: "Sentadilla con salto",
      description:
        "Baja en sentadilla y salta con fuerza hacia arriba; aterriza con las rodillas flexionadas y repite.",
    },
    pistol_squat: {
      name: "Sentadilla a una pierna (pistol)",
      description:
        "Apoyado en una pierna con la otra extendida al frente, baja en sentadilla profunda y sube sin ayuda.",
    },
    sissy_squat: {
      name: "Sentadilla sissy",
      description:
        "De pie sobre las puntas de los pies, inclina el torso hacia atrás mientras flexionas las rodillas hacia delante y vuelve a subir.",
    },
    smith_machine_squat: {
      name: "Sentadilla en multipower",
      description:
        "Con la barra guiada del multipower sobre los trapecios, baja flexionando cadera y rodillas y sube empujando el suelo.",
    },
    hack_squat: {
      name: "Sentadilla hack",
      description:
        "Con la espalda apoyada en la máquina hack, baja flexionando las rodillas y sube empujando la plataforma.",
    },
    pendulum_squat: {
      name: "Sentadilla péndulo",
      description:
        "En la máquina de péndulo, baja flexionando las rodillas con el movimiento en arco y sube empujando la plataforma.",
    },
    belt_squat: {
      name: "Sentadilla con cinturón",
      description:
        "Con el peso colgado de un cinturón en la cadera, baja en sentadilla con el torso erguido y sube empujando el suelo.",
    },
    leg_press: {
      name: "Prensa de piernas",
      description:
        "Sentado en la prensa, baja la plataforma flexionando las rodillas y empújala hasta casi extenderlas sin bloquearlas.",
    },
    single_leg_press: {
      name: "Prensa de piernas a una pierna",
      description:
        "Con un solo pie en la plataforma, flexiona la rodilla para bajarla y empuja para volver sin bloquear la rodilla.",
    },
    high_foot_leg_press: {
      name: "Prensa de piernas con pies altos",
      description:
        "Coloca los pies altos en la plataforma, baja flexionando cadera y rodillas y empuja hasta casi extender las piernas.",
    },
    leg_extension: {
      name: "Extensión de cuádriceps",
      description:
        "Sentado en la máquina, estira las rodillas hasta subir las piernas y baja despacio.",
    },
    single_leg_extension: {
      name: "Extensión de cuádriceps a una pierna",
      description:
        "Sentado en la máquina, estira una rodilla hasta subir la pierna y baja despacio.",
    },
    wall_sit: {
      name: "Sentadilla isométrica en la pared",
      description:
        "Con la espalda apoyada en la pared y las rodillas a 90°, mantén la posición.",
    },
    reverse_nordic_curl: {
      name: "Nordic inverso",
      description:
        "De rodillas con el torso erguido, inclínate hacia atrás con el cuerpo recto y vuelve a la posición inicial.",
    },
    // Lunges and single-leg work
    lunge: {
      name: "Zancada con mancuernas",
      description:
        "Con una mancuerna en cada mano, da un paso al frente, baja hasta que ambas rodillas formen unos 90° y empuja para volver.",
    },
    barbell_lunge: {
      name: "Zancada con barra",
      description:
        "Con la barra sobre los trapecios, da un paso al frente, baja hasta que ambas rodillas formen unos 90° y empuja para volver.",
    },
    walking_lunge: {
      name: "Zancadas caminando",
      description:
        "Con mancuernas, da un paso largo, baja la rodilla trasera hacia el suelo y avanza alternando las piernas.",
    },
    reverse_lunge: {
      name: "Zancada hacia atrás",
      description:
        "Con mancuernas, da un paso atrás, baja hasta que ambas rodillas formen unos 90° y empuja para volver.",
    },
    bodyweight_lunge: {
      name: "Zancada sin peso",
      description:
        "Da un paso al frente, baja hasta que ambas rodillas formen unos 90° y empuja para volver a la posición inicial.",
    },
    lateral_lunge: {
      name: "Zancada lateral",
      description:
        "Da un paso largo hacia un lado, flexiona esa rodilla manteniendo la otra pierna estirada y empuja para volver.",
    },
    curtsy_lunge: {
      name: "Zancada cruzada (curtsy)",
      description:
        "Lleva una pierna por detrás de la otra en diagonal, baja hasta que ambas rodillas formen unos 90° y vuelve arriba.",
    },
    bulgarian_split_squat: {
      name: "Sentadilla búlgara",
      description:
        "Con el pie trasero apoyado en un banco y mancuernas en las manos, baja flexionando la rodilla delantera y sube.",
    },
    split_squat: {
      name: "Sentadilla dividida",
      description:
        "Con un pie delante y otro detrás sin moverlos, baja flexionando ambas rodillas con mancuernas en las manos y sube.",
    },
    step_up: {
      name: "Subida al cajón",
      description:
        "Con mancuernas, sube a un cajón o banco apoyando todo el pie y baja con control; alterna las piernas.",
    },
    cossack_squat: {
      name: "Sentadilla cosaca",
      description:
        "Con los pies muy abiertos, baja desplazando el peso hacia una pierna flexionada mientras la otra queda estirada, y alterna.",
    },
    sumo_squat: {
      name: "Sentadilla sumo",
      description:
        "Con los pies muy abiertos y las puntas hacia fuera, sujeta una mancuerna entre las piernas y baja con el torso erguido.",
    },
    // Hamstrings
    lying_leg_curl: {
      name: "Curl femoral tumbado",
      description:
        "Tumbado boca abajo en la máquina, flexiona las rodillas llevando los talones hacia los glúteos y baja con control.",
    },
    seated_leg_curl: {
      name: "Curl femoral sentado",
      description:
        "Sentado en la máquina, flexiona las rodillas llevando los talones hacia abajo y atrás y vuelve despacio.",
    },
    standing_leg_curl: {
      name: "Curl femoral de pie",
      description:
        "De pie en la máquina, flexiona una rodilla llevando el talón hacia el glúteo y baja con control.",
    },
    nordic_curl: {
      name: "Curl nórdico",
      description:
        "De rodillas con los tobillos sujetos, baja el torso hacia delante lo más despacio posible y ayúdate de las manos para volver.",
    },
    stability_ball_leg_curl: {
      name: "Curl femoral con fitball",
      description:
        "Tumbado con los talones sobre la pelota y la cadera elevada, flexiona las rodillas acercando la pelota a los glúteos.",
    },
    glute_ham_raise: {
      name: "Elevación glúteo-isquio (GHR)",
      description:
        "En el banco GHD con los pies sujetos, baja el torso con el cuerpo recto y vuelve arriba flexionando las rodillas y extendiendo la cadera.",
    },
    // Glutes
    hip_thrust: {
      name: "Hip thrust",
      description:
        "Con la espalda alta apoyada en un banco y la barra sobre la cadera, empuja la cadera hacia arriba hasta alinear torso y muslos.",
    },
    smith_machine_hip_thrust: {
      name: "Hip thrust en multipower",
      description:
        "Con la espalda alta apoyada en un banco y la barra del multipower sobre la cadera, empuja la cadera hacia arriba hasta alinear torso y muslos.",
    },
    machine_hip_thrust: {
      name: "Hip thrust en máquina",
      description:
        "Sentado en la máquina con la espalda alta apoyada, empuja la cadera hacia arriba contra el cinturón y baja con control.",
    },
    dumbbell_hip_thrust: {
      name: "Hip thrust con mancuerna",
      description:
        "Con la espalda alta apoyada en un banco y una mancuerna sobre la cadera, empuja la cadera hacia arriba y baja con control.",
    },
    single_leg_hip_thrust: {
      name: "Hip thrust a una pierna",
      description:
        "Con la espalda alta apoyada en un banco y una pierna elevada, empuja la cadera hacia arriba con el pie de apoyo y baja con control.",
    },
    glute_bridge: {
      name: "Puente de glúteos",
      description:
        "Tumbado boca arriba con las rodillas flexionadas, eleva la cadera hasta alinear torso y muslos y baja con control.",
    },
    barbell_glute_bridge: {
      name: "Puente de glúteos con barra",
      description:
        "Tumbado en el suelo con la barra sobre la cadera, eleva la cadera hasta alinear torso y muslos y baja con control.",
    },
    single_leg_glute_bridge: {
      name: "Puente de glúteos a una pierna",
      description:
        "Tumbado boca arriba con una pierna estirada en el aire, eleva la cadera empujando con el pie de apoyo y baja con control.",
    },
    frog_pump: {
      name: "Frog pump",
      description:
        "Tumbado con las plantas de los pies juntas y las rodillas abiertas, eleva la cadera apretando los glúteos y baja.",
    },
    donkey_kick: {
      name: "Patada de glúteo a cuatro apoyos",
      description:
        "A cuatro apoyos, eleva una pierna flexionada hacia el techo apretando el glúteo y baja sin apoyar la rodilla.",
    },
    cable_glute_kickback: {
      name: "Patada de glúteo en polea",
      description:
        "Con una tobillera conectada a la polea baja, lleva la pierna hacia atrás extendiendo la cadera y vuelve con control.",
    },
    machine_glute_kickback: {
      name: "Patada de glúteo en máquina",
      description:
        "Apoyado en la máquina, empuja la plataforma hacia atrás con una pierna extendiendo la cadera y vuelve con control.",
    },
    cable_pull_through: {
      name: "Pull-through en polea",
      description:
        "De espaldas a la polea baja con la cuerda entre las piernas, lleva la cadera atrás y vuelve a la posición erguida apretando los glúteos.",
    },
    kettlebell_swing: {
      name: "Swing con kettlebell",
      description:
        "Impulsa la kettlebell con una extensión explosiva de cadera hasta la altura del pecho y déjala volver entre las piernas.",
    },
    single_arm_kettlebell_swing: {
      name: "Swing con kettlebell a una mano",
      description:
        "Impulsa la kettlebell con una mano mediante una extensión explosiva de cadera hasta la altura del pecho sin girar el torso.",
    },
    // Abductors and adductors
    hip_abduction_machine: {
      name: "Abducción de cadera en máquina",
      description:
        "Sentado en la máquina, separa las piernas contra las almohadillas y vuelve despacio.",
    },
    cable_hip_abduction: {
      name: "Abducción de cadera en polea",
      description:
        "De pie con la tobillera conectada a la polea baja, separa la pierna hacia el lado y vuelve con control.",
    },
    side_lying_hip_abduction: {
      name: "Abducción de cadera tumbado",
      description:
        "Tumbado de lado con las piernas estiradas, eleva la pierna de arriba sin girar la cadera y baja con control.",
    },
    fire_hydrant: {
      name: "Fire hydrant",
      description:
        "A cuatro apoyos, eleva una rodilla flexionada hacia un lado sin girar la cadera y baja con control.",
    },
    banded_lateral_walk: {
      name: "Caminata lateral con banda",
      description:
        "Con una banda alrededor de las rodillas o los tobillos y las rodillas ligeramente flexionadas, da pasos laterales manteniendo la tensión.",
    },
    clamshell: {
      name: "Clamshell (almeja)",
      description:
        "Tumbado de lado con las rodillas flexionadas y una banda sobre ellas, abre la rodilla de arriba sin mover la pelvis.",
    },
    hip_adduction_machine: {
      name: "Aducción de cadera en máquina",
      description:
        "Sentado en la máquina, junta las piernas contra las almohadillas y vuelve despacio.",
    },
    cable_hip_adduction: {
      name: "Aducción de cadera en polea",
      description:
        "De pie con la tobillera conectada a la polea baja, lleva la pierna cruzando por delante de la otra y vuelve con control.",
    },
    copenhagen_plank: {
      name: "Plancha Copenhague",
      description:
        "En plancha lateral con la pierna de arriba apoyada en un banco, eleva la cadera y mantén la posición.",
    },
    // Calves
    standing_calf_raise: {
      name: "Elevación de talones de pie",
      description:
        "De pie en la máquina con los hombros bajo las almohadillas, sube sobre las puntas de los pies y baja hasta estirar los gemelos.",
    },
    seated_calf_raise: {
      name: "Elevación de talones sentado",
      description:
        "Sentado con las rodillas bajo las almohadillas, sube sobre las puntas de los pies y baja hasta estirar los gemelos.",
    },
    leg_press_calf_raise: {
      name: "Elevación de talones en prensa",
      description:
        "Sentado en la prensa con las puntas de los pies en el borde de la plataforma, empuja con los tobillos y vuelve despacio.",
    },
    smith_machine_calf_raise: {
      name: "Elevación de talones en multipower",
      description:
        "De pie bajo la barra del multipower con las puntas sobre una plataforma, sube sobre las puntas de los pies y baja con control.",
    },
    dumbbell_calf_raise: {
      name: "Elevación de talones con mancuerna",
      description:
        "De pie con una mancuerna en la mano y las puntas sobre un escalón, sube sobre las puntas de los pies y baja con control.",
    },
    donkey_calf_raise: {
      name: "Elevación de talones en burro",
      description:
        "Con el torso inclinado y el peso sobre la zona lumbar, sube sobre las puntas de los pies y baja hasta estirar los gemelos.",
    },
    bodyweight_calf_raise: {
      name: "Elevación de talones sin peso",
      description:
        "De pie con las puntas sobre un escalón, sube sobre las puntas de los pies y baja hasta estirar los gemelos.",
    },
    single_leg_calf_raise: {
      name: "Elevación de talones a una pierna",
      description:
        "De pie sobre una pierna con la punta del pie en un escalón, sube sobre la punta y baja hasta estirar el gemelo.",
    },
    // Abs
    crunch: {
      name: "Crunch abdominal",
      description:
        "Tumbado con las rodillas flexionadas, eleva los hombros del suelo contrayendo el abdomen y baja con control.",
    },
    reverse_crunch: {
      name: "Crunch inverso",
      description:
        "Tumbado boca arriba, lleva las rodillas hacia el pecho elevando la pelvis del suelo y baja despacio.",
    },
    bicycle_crunch: {
      name: "Crunch bicicleta",
      description:
        "Tumbado, lleva el codo hacia la rodilla contraria mientras extiendes la otra pierna y alterna los lados.",
    },
    sit_up: {
      name: "Sit-up (abdominal completo)",
      description:
        "Tumbado con las rodillas flexionadas, incorpora el torso hasta sentarte y baja con control.",
    },
    decline_sit_up: {
      name: "Sit-up en banco declinado",
      description:
        "Tumbado en un banco declinado con los pies sujetos, incorpora el torso hasta sentarte y baja con control.",
    },
    v_up: {
      name: "V-up",
      description:
        "Tumbado con brazos y piernas estirados, eleva a la vez el torso y las piernas para tocarte los pies con las manos.",
    },
    leg_raise: {
      name: "Elevación de piernas tumbado",
      description:
        "Tumbado boca arriba, eleva las piernas estiradas hasta la vertical y baja sin apoyarlas en el suelo.",
    },
    flutter_kicks: {
      name: "Patada de tijera (flutter kicks)",
      description:
        "Tumbado boca arriba con las piernas elevadas, alterna pequeños movimientos arriba y abajo con las piernas estiradas.",
    },
    hanging_leg_raise: {
      name: "Elevación de piernas colgado",
      description:
        "Colgado de la barra, eleva las piernas estiradas hasta la horizontal o más y baja sin balancearte.",
    },
    hanging_knee_raise: {
      name: "Elevación de rodillas colgado",
      description:
        "Colgado de la barra, eleva las rodillas hacia el pecho y baja sin balancearte.",
    },
    captains_chair_leg_raise: {
      name: "Elevación de piernas en silla romana",
      description:
        "Con los antebrazos apoyados y la espalda contra el respaldo, eleva las rodillas o las piernas estiradas y baja con control.",
    },
    toes_to_bar: {
      name: "Toes to bar",
      description:
        "Colgado de la barra, eleva las piernas hasta tocar la barra con los pies y baja con control.",
    },
    cable_crunch: {
      name: "Crunch en polea",
      description:
        "De rodillas frente a la polea alta con la cuerda junto a la cabeza, flexiona el tronco llevando los codos hacia las rodillas.",
    },
    machine_crunch: {
      name: "Crunch en máquina",
      description:
        "Sentado en la máquina, flexiona el tronco contra la resistencia contrayendo el abdomen y vuelve despacio.",
    },
    ab_wheel_rollout: {
      name: "Rueda abdominal",
      description:
        "De rodillas, desliza la rueda hacia delante extendiendo el cuerpo sin hundir la zona lumbar y vuelve.",
    },
    dragon_flag: {
      name: "Dragon flag",
      description:
        "Tumbado en un banco sujetando el borde, eleva el cuerpo recto apoyado en los hombros y bájalo con control.",
    },
    plank: {
      name: "Plancha",
      description:
        "Apoyado en antebrazos y puntas de los pies, mantén el cuerpo recto.",
    },
    side_plank: {
      name: "Plancha lateral",
      description:
        "Apoyado en un antebrazo y el lado del pie, eleva la cadera y mantén el cuerpo alineado.",
    },
    hollow_hold: {
      name: "Hollow hold",
      description:
        "Tumbado con brazos y piernas estirados, eleva hombros y piernas del suelo manteniendo la zona lumbar pegada al suelo.",
    },
    l_sit: {
      name: "L-sit",
      description:
        "Sujeto entre dos soportes, eleva el cuerpo con los brazos estirados y las piernas rectas al frente y mantén la posición.",
    },
    dead_bug: {
      name: "Dead bug",
      description:
        "Tumbado con brazos y piernas elevados, baja el brazo y la pierna contrarios sin despegar la zona lumbar y alterna.",
    },
    mountain_climber: {
      name: "Mountain climbers",
      description:
        "En posición de plancha alta, lleva las rodillas al pecho de forma alterna y rápida.",
    },
    bear_crawl: {
      name: "Gateo del oso",
      description:
        "A cuatro apoyos con las rodillas elevadas del suelo, avanza moviendo mano y pie contrarios a la vez.",
    },
    // Obliques and rotation
    oblique_crunch: {
      name: "Crunch oblicuo",
      description:
        "Tumbado con las rodillas flexionadas y ladeadas, eleva el hombro hacia la cadera contrayendo el oblicuo.",
    },
    heel_touch: {
      name: "Toques de talón",
      description:
        "Tumbado con las rodillas flexionadas, inclínate hacia un lado tocando el talón con la mano y alterna.",
    },
    russian_twist: {
      name: "Giro ruso",
      description:
        "Sentado con el torso inclinado y los pies elevados, gira el tronco de un lado a otro llevando las manos junto a la cadera.",
    },
    weighted_russian_twist: {
      name: "Giro ruso con peso",
      description:
        "Sentado con el torso inclinado y los pies elevados, gira el tronco de lado a lado sujetando una mancuerna con ambas manos.",
    },
    windshield_wiper: {
      name: "Limpiaparabrisas en el suelo",
      description:
        "Tumbado con las piernas elevadas, baja ambas piernas de un lado a otro sin apoyar los pies.",
    },
    hanging_windshield_wiper: {
      name: "Limpiaparabrisas colgado",
      description:
        "Colgado de la barra con las piernas elevadas, llévalas de un lado a otro controlando el movimiento con el abdomen.",
    },
    cable_woodchop: {
      name: "Leñador en polea (de arriba abajo)",
      description:
        "Con la polea alta, gira el tronco tirando del asa en diagonal hacia la cadera contraria con los brazos casi estirados.",
    },
    low_to_high_cable_woodchop: {
      name: "Leñador en polea (de abajo arriba)",
      description:
        "Con la polea baja, gira el tronco tirando del asa en diagonal hacia arriba y al lado contrario con los brazos casi estirados.",
    },
    pallof_press: {
      name: "Press Pallof",
      description:
        "De pie de lado a la polea con el asa junto al pecho, estira los brazos al frente sin dejar que el cable te gire el tronco.",
    },
    side_bend: {
      name: "Flexión lateral con mancuerna",
      description:
        "De pie con una mancuerna en una mano, inclina el tronco hacia ese lado y vuelve a la vertical.",
    },
    landmine_rotation: {
      name: "Rotación landmine",
      description:
        "De pie sujetando con ambas manos el extremo de la barra anclada, gira el tronco de lado a lado con los brazos extendidos.",
    },
    // Neck
    neck_flexion: {
      name: "Flexión de cuello con disco",
      description:
        "Tumbado boca arriba con la cabeza fuera del banco y un disco ligero sobre la frente, lleva la barbilla hacia el pecho y vuelve despacio.",
    },
    neck_extension: {
      name: "Extensión de cuello con disco",
      description:
        "Tumbado boca abajo con la cabeza fuera del banco y un disco ligero sujeto en la nuca, sube la cabeza hasta alinearla con el cuerpo y baja despacio.",
    },
    neck_lateral_flexion: {
      name: "Flexión lateral de cuello",
      description:
        "Tumbado de lado con la cabeza fuera del banco y un disco ligero sujeto junto a la sien, inclina la cabeza hacia el hombro de arriba y baja despacio.",
    },
    // Olympic and functional lifts
    power_clean: {
      name: "Cargada de potencia",
      description:
        "Desde el suelo, extiende cadera y rodillas con explosividad, encoge los hombros y recibe la barra sobre los hombros en un cuarto de sentadilla.",
    },
    hang_power_clean: {
      name: "Cargada de potencia colgante",
      description:
        "Con la barra a la altura de las rodillas, impulsa con la cadera, encoge los hombros y recíbela sobre los hombros en un cuarto de sentadilla.",
    },
    clean_pull: {
      name: "Tirón de cargada",
      description:
        "Desde el suelo, extiende cadera y rodillas con fuerza y encoge los hombros para subir la barra sin recibirla.",
    },
    snatch: {
      name: "Arrancada",
      description:
        "Con agarre ancho, lleva la barra del suelo a sobre la cabeza en un solo movimiento y recíbela en sentadilla profunda.",
    },
    power_snatch: {
      name: "Arrancada de potencia",
      description:
        "Con agarre ancho, lleva la barra del suelo a sobre la cabeza en un solo movimiento y recíbela en un cuarto de sentadilla.",
    },
    clean_and_jerk: {
      name: "Dos tiempos (cargada y envión)",
      description:
        "Lleva la barra del suelo a los hombros y, con un impulso de piernas, de ahí a sobre la cabeza.",
    },
    thruster: {
      name: "Thruster",
      description:
        "Con la barra sobre los hombros, baja en sentadilla y, al subir, empuja la barra sobre la cabeza en un solo movimiento.",
    },
    dumbbell_thruster: {
      name: "Thruster con mancuernas",
      description:
        "Con una mancuerna en cada hombro, baja en sentadilla y, al subir, empújalas sobre la cabeza en un solo movimiento.",
    },
    dumbbell_snatch: {
      name: "Arrancada con mancuerna",
      description:
        "Con una mancuerna entre los pies, extiende cadera y rodillas y lleva la mancuerna sobre la cabeza en un solo movimiento.",
    },
    kettlebell_clean: {
      name: "Cargada con kettlebell",
      description:
        "Desde una bisagra de cadera, impulsa la kettlebell hacia arriba y recíbela apoyada en el antebrazo junto al hombro.",
    },
    kettlebell_snatch: {
      name: "Arrancada con kettlebell",
      description:
        "Desde una bisagra de cadera, impulsa la kettlebell en un solo movimiento hasta estirar el brazo sobre la cabeza.",
    },
    kettlebell_clean_and_press: {
      name: "Cargada y press con kettlebell",
      description:
        "Lleva la kettlebell al hombro con un impulso de cadera y empújala sobre la cabeza hasta estirar el brazo.",
    },
    kettlebell_turkish_get_up: {
      name: "Turkish get-up",
      description:
        "Tumbado con la kettlebell estirada sobre el hombro, ponte de pie en varios pasos sin bajar el brazo y desanda el recorrido.",
    },
    medicine_ball_slam: {
      name: "Lanzamiento de balón medicinal al suelo",
      description:
        "Eleva el balón sobre la cabeza y lánzalo con fuerza contra el suelo flexionando el tronco; recógelo y repite.",
    },
    wall_ball: {
      name: "Wall ball",
      description:
        "Con un balón medicinal frente al pecho, haz una sentadilla y, al subir, lánzalo a una diana en la pared; recógelo y repite.",
    },
    // Plyometrics and conditioning
    box_jump: {
      name: "Salto al cajón",
      description:
        "Desde una sentadilla corta, salta sobre un cajón aterrizando con las rodillas flexionadas y baja con control.",
    },
    broad_jump: {
      name: "Salto de longitud a pies juntos",
      description:
        "Balancea los brazos, salta hacia delante lo más lejos posible y aterriza con las rodillas flexionadas.",
    },
    skater_jump: {
      name: "Salto de patinador",
      description:
        "Salta lateralmente de una pierna a la otra, aterrizando en un pie con la rodilla flexionada y el otro pie cruzado por detrás.",
    },
    burpee: {
      name: "Burpee",
      description:
        "Baja a plancha, haz una flexión, recoge los pies hacia las manos y salta hacia arriba con los brazos extendidos.",
    },
    battle_ropes: {
      name: "Cuerdas de batalla",
      description:
        "Con una cuerda en cada mano y las rodillas flexionadas, haz ondas rápidas con los brazos mientras mantienes el torso firme.",
    },
    jumping_jack: {
      name: "Jumping jacks",
      description:
        "Salta abriendo piernas y brazos por encima de la cabeza y vuelve a juntarlos con otro salto.",
    },
    high_knees: {
      name: "Rodillas arriba",
      description:
        "Corre en el sitio llevando las rodillas lo más alto posible a un ritmo rápido.",
    },
    jump_rope: {
      name: "Comba",
      description:
        "Salta con pequeños impulsos de tobillo mientras giras la cuerda con las muñecas.",
    },
    // Cardio
    running: {
      name: "Correr",
      description:
        "Corre al aire libre a un ritmo constante con el torso erguido y una zancada relajada.",
    },
    walking: {
      name: "Caminar",
      description:
        "Camina a paso ligero con el torso erguido y los brazos relajados.",
    },
    treadmill_run: {
      name: "Carrera en cinta",
      description:
        "Corre sobre la cinta a un ritmo constante con el torso erguido sin agarrarte a las barras.",
    },
    treadmill_walk: {
      name: "Caminata en cinta",
      description:
        "Camina sobre la cinta a paso ligero con el torso erguido sin agarrarte a las barras.",
    },
    incline_treadmill_walk: {
      name: "Caminata en cinta con inclinación",
      description:
        "Camina sobre la cinta con una pendiente elevada y el torso erguido sin agarrarte a las barras.",
    },
    stationary_bike: {
      name: "Bicicleta estática",
      description: "Pedalea sentado con la espalda recta y un ritmo constante.",
    },
    assault_bike: {
      name: "Bicicleta de aire (assault bike)",
      description:
        "Pedalea mientras empujas y tiras de las palancas a la vez, aumentando el ritmo según el esfuerzo deseado.",
    },
    rowing_machine: {
      name: "Máquina de remo",
      description:
        "Empuja con las piernas, inclina el torso hacia atrás y tira del asa hacia el abdomen; vuelve en orden inverso.",
    },
    elliptical: {
      name: "Elíptica",
      description:
        "Desliza los pies siguiendo el movimiento de la máquina con el torso erguido y un ritmo constante.",
    },
    stair_climber: {
      name: "Escaladora (stair climber)",
      description:
        "Sube los escalones de la máquina de forma continua con el torso erguido y sin apoyarte en las barras.",
    },
    ski_erg: {
      name: "Ski erg",
      description:
        "De pie frente a la máquina, tira de las asas desde arriba hacia las caderas flexionando el tronco y las rodillas.",
    },
    swimming: {
      name: "Natación",
      description:
        "Nada a un ritmo constante coordinando brazos, piernas y respiración.",
    },
  } satisfies Record<ExerciseKey, { name: string; description: string }>,
  muscles: {
    chest: "Pecho",
    front_delts: "Deltoides anterior",
    triceps: "Tríceps",
    abs: "Abdominales",
    side_delts: "Deltoides lateral",
    traps: "Trapecio",
    lats: "Dorsales",
    biceps: "Bíceps",
    forearms: "Antebrazos",
    glutes: "Glúteos",
    quads: "Cuádriceps",
    hamstrings: "Isquiotibiales",
    calves: "Pantorrillas",
    obliques: "Oblicuos",
    rear_delts: "Deltoides posterior",
    neck: "Cuello",
    lower_back: "Parte baja de la espalda",
    upper_back: "Parte superior de la espalda",
    adductors: "Aductores",
    abductors: "Abductores",
    hip_flexors: "Flexores de la cadera",
  } satisfies Record<MuscleId, string>,
  muscleGroups: {
    chest: "Pecho",
    back: "Espalda",
    shoulders: "Hombros",
    arms: "Brazos",
    neck: "Cuello",
    legs: "Piernas",
    core: "Core",
  } satisfies Record<MuscleGroup, string>,
  equipment: {
    barbell: "Barra",
    dumbbell: "Mancuernas",
    cable: "Polea",
    machine: "Máquina",
    kettlebells: "Kettlebell",
    bands: "Bandas",
    medicine_ball: "Balón medicinal",
    exercise_ball: "Fitball",
    foam_roll: "Rodillo de espuma",
    ez_bar: "Barra Z",
    bodyweight: "Peso corporal",
    other: "Otro",
  } satisfies Record<Equipment, string>,
  notifications: {
    channel: "Entrenamiento en curso",
  },
  errors: {
    database:
      "No se han podido cargar tus datos. Cierra la app y vuelve a abrirla.",
    openUrl: "No se ha podido abrir el enlace",
  },
};

export type Translations = typeof es;
