import type { Translations } from "./es";

export const en: Translations = {
  tabs: {
    today: "Today",
    routines: "Routines",
    progress: "Progress",
    profile: "Profile",
  },
  today: {
    title: "What's on today?",
  },
  routines: {
    title: "Routines",
    subtitle: "Prepare them once and choose the one for each day.",
    add: "New Routine",
  },
  new_routine: {
    bread_crumb: "Cancel",
    title1: "New",
    title2: "Routine",
    nameLabel: "Name",
    namePlaceholder: "Routine name",
    muscleLabel: "Muscle",
    showMore: "Show more",
    showLess: "Show less",
    exercisesLabel: "Exercises",
    exercisesLabelSecondary: "Drag to reorder",
    addExercise: "Add exercise",
  },
  new_exercises: {
    bread_crumb: "New Routine",
    title: "Exercises",
  },
  exercises: {
    namePlaceholder: "Exercise name",
    descriptionPlaceholder: "Description (optional)",
    add: "Add exercise",
    saveError: "Couldn't save the exercise",
    empty: "No exercises yet",
    trackingTypes: {
      weight_reps: "Weight + reps",
      bodyweight_reps: "Bodyweight",
      duration: "Duration",
      distance_duration: "Distance",
    },
  },
  exerciseCatalog: {
    bench_press: {
      name: "Bench press",
      description:
        "Lying on the bench, lower the bar to your chest and press until your arms are straight.",
    },
    incline_bench_press: {
      name: "Incline Bench Press",
      description:
        "On an incline bench, lower the bar to your upper chest and press until your arms are straight.",
    },
    decline_bench_press: {
      name: "Decline Bench Press",
      description:
        "On a decline bench, lower the bar to your lower chest and press until your arms are straight.",
    },
    dumbbell_bench_press: {
      name: "Dumbbell Bench Press",
      description:
        "Lying on the bench, lower the dumbbells to the sides of your chest and press them up until your arms are straight.",
    },
    incline_dumbbell_press: {
      name: "Incline Dumbbell Press",
      description:
        "On an incline bench, lower the dumbbells to the sides of your upper chest and press them up until your arms are straight.",
    },
    decline_dumbbell_press: {
      name: "Decline Dumbbell Press",
      description:
        "On a decline bench, lower the dumbbells to the sides of your lower chest and press them up until your arms are straight.",
    },
    floor_press: {
      name: "Barbell Floor Press",
      description:
        "Lying on the floor, lower the bar until your elbows touch the ground and press until your arms are straight.",
    },
    dumbbell_floor_press: {
      name: "Dumbbell Floor Press",
      description:
        "Lying on the floor, lower the dumbbells until your elbows touch the ground and press them up until your arms are straight.",
    },
    smith_machine_bench_press: {
      name: "Smith Machine Bench Press",
      description:
        "Lying under the guided bar of the Smith machine, lower it to your chest and press until your arms are straight.",
    },
    smith_machine_incline_press: {
      name: "Smith Machine Incline Press",
      description:
        "On an incline bench under the Smith machine, lower the bar to your upper chest and press until your arms are straight.",
    },
    machine_chest_press: {
      name: "Machine Chest Press",
      description:
        "Seated with your back against the pad, push the handles forward until your arms are straight and return with control.",
    },
    incline_machine_chest_press: {
      name: "Incline Machine Chest Press",
      description:
        "Seated at the incline press machine, push the handles up and forward until your arms are straight.",
    },
    cable_chest_press: {
      name: "Cable Chest Press",
      description:
        "Standing with your back to the cables, push the handles forward until your arms are straight and return with control.",
    },
    dumbbell_fly: {
      name: "Dumbbell Fly",
      description:
        "Lying on the bench, open your arms with a slight bend in your elbows until you feel a stretch, then bring them together over your chest.",
    },
    incline_dumbbell_fly: {
      name: "Incline Dumbbell Fly",
      description:
        "On an incline bench, open your arms with a slight bend in your elbows and bring them together over your upper chest.",
    },
    cable_fly: {
      name: "Cable Fly",
      description:
        "Standing between two cables at chest height, bring the handles together in front of you with a slight bend in your elbows.",
    },
    cable_crossover: {
      name: "Cable Crossover",
      description:
        "Standing between two high cables, bring the handles down and forward until they cross in front of your body.",
    },
    low_cable_crossover: {
      name: "Low Cable Crossover",
      description:
        "Standing between two low cables, sweep the handles up in an arc until they meet at upper-chest height.",
    },
    pec_deck: {
      name: "Pec Deck Fly",
      description:
        "Seated with your back against the pad, bring your arms together in front of your chest and return slowly to the start.",
    },
    dumbbell_pullover: {
      name: "Dumbbell Pullover",
      description:
        "Lying on the bench, lower the dumbbell behind your head with your arms nearly straight and bring it back over your chest.",
    },
    svend_press: {
      name: "Svend Press",
      description:
        "Standing, hold a plate between your palms at chest height, press it forward while squeezing hard and return.",
    },
    push_up: {
      name: "Push-Up",
      description:
        "In a plank position with your hands under your shoulders, lower your chest to the floor and press until your arms are straight.",
    },
    incline_push_up: {
      name: "Incline Push-Up",
      description:
        "With your hands on a bench or a raised surface, lower your chest toward it and press until your arms are straight.",
    },
    decline_push_up: {
      name: "Decline Push-Up",
      description:
        "With your feet on a bench and your hands on the floor, lower your chest to the floor and press until your arms are straight.",
    },
    knee_push_up: {
      name: "Knee Push-Up",
      description:
        "Supported on your hands and knees with a straight line from knees to head, lower your chest to the floor and press back up.",
    },
    wide_push_up: {
      name: "Wide-Grip Push-Up",
      description:
        "With your hands wider than your shoulders, lower your chest to the floor and press until your arms are straight.",
    },
    diamond_push_up: {
      name: "Diamond Push-Up",
      description:
        "With your hands together under your chest, forming a diamond with your thumbs and index fingers, lower your chest to your hands and press up.",
    },
    archer_push_up: {
      name: "Archer Push-Up",
      description:
        "With your hands set wide, shift your weight toward one arm as you lower while the other arm stays straight, then press back up.",
    },
    clap_push_up: {
      name: "Clap Push-Up",
      description:
        "Lower your chest to the floor and push explosively so your hands leave the ground, clap in the air and absorb the landing.",
    },
    weighted_push_up: {
      name: "Weighted Push-Up",
      description:
        "Do push-ups with a plate or a loaded backpack on your back, lowering your chest to the floor and pressing back up.",
    },
    dip: {
      name: "Parallel Bar Dip",
      description:
        "Supported on parallel bars, lower yourself by bending your elbows to about 90° and press until your arms are straight.",
    },
    chest_dip: {
      name: "Chest Dip",
      description:
        "On parallel bars, lean your torso forward and lower until you feel a stretch in your chest, then press back up.",
    },
    weighted_dip: {
      name: "Weighted Dip",
      description:
        "Do dips on parallel bars with a weight belt or a dumbbell between your feet, lowering and rising with control.",
    },
    bench_dip: {
      name: "Bench Dip",
      description:
        "With your hands on a bench behind you and your legs straight, lower by bending your elbows and press back up.",
    },
    assisted_dip: {
      name: "Assisted Dip Machine",
      description:
        "Supported on the assistance platform, lower by bending your elbows and press until your arms are straight; the weight is the help you get.",
    },
    machine_dip: {
      name: "Machine Dip",
      description:
        "Seated in the machine, push the handles down until your elbows are straight and return with control.",
    },
    band_chest_press: {
      name: "Band Chest Press",
      description:
        "With the band around your back and the ends in your hands, press forward until your arms are straight and return with control.",
    },
    // Shoulders
    overhead_press: {
      name: "Overhead Press",
      description:
        "Standing, press the bar from your shoulders until your arms are straight overhead and lower it with control.",
    },
    seated_overhead_press: {
      name: "Seated Overhead Press",
      description:
        "Seated with your back straight, press the bar from your shoulders until your arms are straight overhead.",
    },
    push_press: {
      name: "Push Press",
      description:
        "With the bar on your shoulders, dip slightly at the knees and drive with your legs to launch the bar overhead.",
    },
    behind_the_neck_press: {
      name: "Behind-the-Neck Press",
      description:
        "Seated, lower the bar behind your head to ear level and press until your arms are straight; requires good shoulder mobility.",
    },
    dumbbell_shoulder_press: {
      name: "Dumbbell Shoulder Press",
      description:
        "Seated with your back supported, press the dumbbells from your shoulders until your arms are straight overhead.",
    },
    standing_dumbbell_press: {
      name: "Standing Dumbbell Shoulder Press",
      description:
        "Standing with your core braced, press the dumbbells from your shoulders until your arms are straight overhead.",
    },
    arnold_press: {
      name: "Arnold Press",
      description:
        "Start with the dumbbells in front of your chest and your palms facing you; rotate your wrists as you press until your arms are straight overhead.",
    },
    single_arm_dumbbell_press: {
      name: "Single-Arm Dumbbell Press",
      description:
        "Standing, press one dumbbell from your shoulder until your arm is straight overhead, without leaning your torso.",
    },
    machine_shoulder_press: {
      name: "Machine Shoulder Press",
      description:
        "Seated with your back supported, press the handles up until your arms are straight and lower with control.",
    },
    smith_machine_shoulder_press: {
      name: "Smith Machine Shoulder Press",
      description:
        "Seated under the guided bar of the Smith machine, press it from chin height until your arms are straight.",
    },
    kettlebell_press: {
      name: "Kettlebell Press",
      description:
        "Standing with the kettlebell resting on your shoulder, press it overhead until your arm is straight and lower it with control.",
    },
    landmine_press: {
      name: "Landmine Press",
      description:
        "Standing with the end of the bar anchored to the floor, press it up and forward until your arm is straight.",
    },
    band_shoulder_press: {
      name: "Band Shoulder Press",
      description:
        "Standing on the band, press the ends from your shoulders until your arms are straight overhead.",
    },
    lateral_raise: {
      name: "Dumbbell Lateral Raise",
      description:
        "Standing, raise the dumbbells out to your sides to shoulder height with a slight bend in your elbows.",
    },
    seated_lateral_raise: {
      name: "Seated Lateral Raise",
      description:
        "Seated with your back straight, raise the dumbbells out to your sides to shoulder height and lower slowly.",
    },
    cable_lateral_raise: {
      name: "Cable Lateral Raise",
      description:
        "Standing sideways to the low cable, raise the handle out to the side to shoulder height and lower with control.",
    },
    machine_lateral_raise: {
      name: "Machine Lateral Raise",
      description:
        "Seated in the machine, raise your arms out to the sides against the pads to shoulder height and return slowly.",
    },
    band_lateral_raise: {
      name: "Band Lateral Raise",
      description:
        "Standing on the band, raise your hands out to the sides to shoulder height and lower with control.",
    },
    front_raise: {
      name: "Dumbbell Front Raise",
      description:
        "Standing, raise the dumbbells in front of you to shoulder height with your arms nearly straight.",
    },
    barbell_front_raise: {
      name: "Barbell Front Raise",
      description:
        "Standing with the bar in front of your thighs, raise it in front of you to shoulder height with your arms nearly straight.",
    },
    plate_front_raise: {
      name: "Plate Front Raise",
      description:
        "Hold a plate with both hands and raise it in front of you to eye level with your arms nearly straight.",
    },
    cable_front_raise: {
      name: "Cable Front Raise",
      description:
        "Facing away from the low cable, raise the handle or rope in front of you to shoulder height.",
    },
    pike_push_up: {
      name: "Pike Push-Up",
      description:
        "With your hips raised in an inverted V, lower your head toward the floor by bending your elbows and press back up.",
    },
    handstand_push_up: {
      name: "Handstand Push-Up",
      description:
        "Upside down with your feet against the wall, lower your head toward the floor and press until your arms are straight.",
    },
    wall_handstand_hold: {
      name: "Wall Handstand Hold",
      description:
        "Upside down with your feet against the wall and your arms straight, hold the position.",
    },
    // Rear delts and rotator cuff
    rear_delt_fly: {
      name: "Dumbbell Rear Delt Fly",
      description:
        "With your torso bent forward, raise your arms out to the sides to shoulder height while squeezing your shoulder blades together.",
    },
    chest_supported_rear_delt_fly: {
      name: "Chest-Supported Rear Delt Fly",
      description:
        "With your chest on an incline bench, raise your arms out to the sides while squeezing your shoulder blades together and lower slowly.",
    },
    reverse_pec_deck: {
      name: "Reverse Pec Deck Fly",
      description:
        "Seated facing the pad, open your arms backward until they line up with your shoulders and return slowly.",
    },
    cable_rear_delt_fly: {
      name: "Cable Rear Delt Fly",
      description:
        "Standing between two cables, grab the opposite handle with each hand and open your arms out to the sides and back.",
    },
    face_pull: {
      name: "Face Pull",
      description:
        "With the rope on a high cable, pull toward your face while flaring your elbows and rotating your shoulders outward.",
    },
    band_face_pull: {
      name: "Band Face Pull",
      description:
        "With the band anchored at face height, pull toward you while flaring your elbows until your hands reach your ears.",
    },
    band_pull_apart: {
      name: "Band Pull-Apart",
      description:
        "With your arms straight in front of you, pull the band apart until your chest opens and return with control.",
    },
    dumbbell_external_rotation: {
      name: "Dumbbell External Rotation",
      description:
        "Lying on your side with your elbow tucked against your body and bent to 90°, rotate your forearm upward without lifting your elbow.",
    },
    cable_external_rotation: {
      name: "Cable External Rotation",
      description:
        "Standing sideways to the cable with your elbow tucked and bent to 90°, rotate your forearm outward and return slowly.",
    },
    band_external_rotation: {
      name: "Band External Rotation",
      description:
        "With your elbow tucked and bent to 90° and the band anchored to one side, rotate your forearm outward and return slowly.",
    },
    // Traps
    upright_row: {
      name: "Barbell Upright Row",
      description:
        "Standing, pull the bar up close to your body to chest height, leading with your elbows above your hands.",
    },
    dumbbell_upright_row: {
      name: "Dumbbell Upright Row",
      description:
        "Standing, pull the dumbbells up close to your body to chest height, leading with your elbows above your hands.",
    },
    cable_upright_row: {
      name: "Cable Upright Row",
      description:
        "Standing facing the low cable, pull the bar up close to your body to chest height, leading with your elbows above your hands.",
    },
    barbell_shrug: {
      name: "Barbell Shrug",
      description:
        "Standing with the bar hanging in front of you, raise your shoulders toward your ears, hold briefly and lower.",
    },
    dumbbell_shrug: {
      name: "Dumbbell Shrug",
      description:
        "Standing with a dumbbell in each hand, raise your shoulders toward your ears, hold briefly and lower.",
    },
    trap_bar_shrug: {
      name: "Trap Bar Shrug",
      description:
        "Standing inside the trap bar, raise your shoulders toward your ears, hold briefly and lower.",
    },
    // Back: pull-ups and pulldowns
    pull_up: {
      name: "Pull-Up",
      description:
        "Hanging from the bar with an overhand grip slightly wider than your shoulders, pull up until your chin clears the bar and lower with control.",
    },
    chin_up: {
      name: "Chin-Up",
      description:
        "Hanging from the bar with an underhand grip at shoulder width, pull up until your chin clears the bar and lower with control.",
    },
    neutral_grip_pull_up: {
      name: "Neutral-Grip Pull-Up",
      description:
        "Hanging from parallel handles with your palms facing each other, pull up until your chin clears the handles and lower with control.",
    },
    wide_grip_pull_up: {
      name: "Wide-Grip Pull-Up",
      description:
        "Hanging from the bar with your hands much wider than your shoulders, pull your chest toward the bar and lower slowly.",
    },
    weighted_pull_up: {
      name: "Weighted Pull-Up",
      description:
        "Do pull-ups with a weight belt or a dumbbell between your feet, pulling up until your chin clears the bar.",
    },
    weighted_chin_up: {
      name: "Weighted Chin-Up",
      description:
        "Do chin-ups with an underhand grip and a weight belt or a dumbbell between your feet, pulling up until your chin clears the bar.",
    },
    assisted_pull_up: {
      name: "Assisted Pull-Up Machine",
      description:
        "Supported on the assistance platform, pull up until your chin clears the bar and lower slowly; the weight is the help you get.",
    },
    negative_pull_up: {
      name: "Negative Pull-Up",
      description:
        "Jump or step up to get your chin over the bar, then lower as slowly as you can until your arms are straight.",
    },
    dead_hang: {
      name: "Dead Hang",
      description:
        "Hang from a bar with your arms straight and your shoulders engaged for as long as you can.",
    },
    lat_pulldown: {
      name: "Lat Pulldown",
      description:
        "Seated facing the high cable, pull the wide bar down to your upper chest and return with control.",
    },
    neutral_grip_lat_pulldown: {
      name: "Neutral-Grip Lat Pulldown",
      description:
        "Seated facing the high cable with a V-handle, pull the handle down to your chest and return slowly.",
    },
    reverse_grip_lat_pulldown: {
      name: "Reverse-Grip Lat Pulldown",
      description:
        "Seated facing the high cable with your palms facing you, pull the bar down to your upper chest and return with control.",
    },
    single_arm_lat_pulldown: {
      name: "Single-Arm Lat Pulldown",
      description:
        "Seated facing the high cable, pull the handle down with one arm to the side of your chest and return slowly.",
    },
    straight_arm_pulldown: {
      name: "Straight-Arm Pulldown",
      description:
        "Standing facing the high cable, push the bar or rope down to your thighs with your arms nearly straight.",
    },
    machine_pullover: {
      name: "Machine Pullover",
      description:
        "Seated in the machine, sweep your elbows from overhead down toward your abdomen and return with control.",
    },
    band_pulldown: {
      name: "Band Pulldown",
      description:
        "With the band anchored overhead, pull down with your arms nearly straight until your hands reach your thighs.",
    },
    // Back: rows
    barbell_row: {
      name: "Barbell Row",
      description:
        "With your torso bent forward and your back straight, pull the bar to your abdomen and lower it with control.",
    },
    pendlay_row: {
      name: "Pendlay Row",
      description:
        "With your torso parallel to the floor, pull the bar to your abdomen and return it to the floor on every rep.",
    },
    underhand_barbell_row: {
      name: "Underhand Barbell Row",
      description:
        "With your torso bent forward and your palms facing up, pull the bar to your lower abdomen and lower with control.",
    },
    t_bar_row: {
      name: "T-Bar Row",
      description:
        "With your torso bent forward over the anchored bar, pull the handle to your chest and lower with control.",
    },
    chest_supported_t_bar_row: {
      name: "Chest-Supported T-Bar Row",
      description:
        "With your chest on the pad, pull the handles toward your torso while squeezing your shoulder blades together and lower with control.",
    },
    seal_row: {
      name: "Seal Row",
      description:
        "Lying face down on a raised bench, pull the bar toward your torso and lower it until your arms are straight.",
    },
    dumbbell_row: {
      name: "Single-Arm Dumbbell Row",
      description:
        "With one hand and one knee on the bench, pull the dumbbell to your hip and lower with control.",
    },
    chest_supported_dumbbell_row: {
      name: "Chest-Supported Dumbbell Row",
      description:
        "Lying face down on an incline bench, pull the dumbbells toward your ribs while squeezing your shoulder blades together.",
    },
    bent_over_dumbbell_row: {
      name: "Bent-Over Dumbbell Row",
      description:
        "With your torso bent forward and your back straight, pull both dumbbells to your hips and lower with control.",
    },
    meadows_row: {
      name: "Meadows Row",
      description:
        "Standing sideways to an anchored bar (landmine), hinge forward and pull the end of the bar toward your hip.",
    },
    seated_cable_row: {
      name: "Seated Cable Row",
      description:
        "Seated with your knees slightly bent, pull the handle to your abdomen with a straight back and return with control.",
    },
    wide_grip_seated_row: {
      name: "Wide-Grip Seated Cable Row",
      description:
        "Seated facing the low cable with a wide bar, pull to your mid-chest while flaring your elbows.",
    },
    single_arm_cable_row: {
      name: "Single-Arm Cable Row",
      description:
        "Seated or standing facing the cable, pull the handle to your hip with one arm and return with control.",
    },
    machine_row: {
      name: "Machine Row",
      description:
        "Seated with your chest against the pad, pull the handles toward your torso while squeezing your shoulder blades together and return slowly.",
    },
    machine_high_row: {
      name: "High Row Machine",
      description:
        "Seated in the high row machine, pull the handles down and back until your elbows are tight to your torso.",
    },
    inverted_row: {
      name: "Inverted Row",
      description:
        "Lying under a low bar with your body straight, pull your chest to the bar and lower with control.",
    },
    suspension_row: {
      name: "Suspension Trainer Row (TRX)",
      description:
        "Leaning back while holding the suspension handles, pull your chest toward your hands and lower with control.",
    },
    kettlebell_row: {
      name: "Kettlebell Row",
      description:
        "With your torso bent forward and one hand supported, pull the kettlebell to your hip and lower with control.",
    },
    renegade_row: {
      name: "Renegade Row",
      description:
        "In a plank position on two dumbbells, pull one to your hip without rotating your torso and alternate sides.",
    },
    band_row: {
      name: "Band Row",
      description:
        "Seated with the band around your feet, pull the ends to your abdomen while squeezing your shoulder blades together.",
    },
    // Posterior chain and lower back
    deadlift: {
      name: "Deadlift",
      description:
        "With the bar over your feet, extend your hips and knees while keeping your back straight until you stand tall, then lower with control.",
    },
    sumo_deadlift: {
      name: "Sumo Deadlift",
      description:
        "With a very wide stance and your hands gripping inside your legs, lift the bar by extending your hips and knees.",
    },
    romanian_deadlift: {
      name: "Romanian Deadlift",
      description:
        "Standing with the bar in your hands, push your hips back with your knees nearly straight until you feel a stretch in your hamstrings, then return.",
    },
    stiff_leg_deadlift: {
      name: "Stiff-Leg Deadlift",
      description:
        "With your legs nearly straight, hinge forward lowering the bar toward your feet and return by extending your hips.",
    },
    trap_bar_deadlift: {
      name: "Trap Bar Deadlift",
      description:
        "Standing inside the trap bar, push the floor away with your feet and extend your hips and knees until you stand tall.",
    },
    dumbbell_romanian_deadlift: {
      name: "Dumbbell Romanian Deadlift",
      description:
        "Standing with a dumbbell in each hand, push your hips back with your knees nearly straight and return while squeezing your glutes.",
    },
    single_leg_romanian_deadlift: {
      name: "Single-Leg Romanian Deadlift",
      description:
        "Balancing on one leg, hinge forward while extending the other leg behind you and lower the dumbbells toward the floor before returning.",
    },
    kettlebell_deadlift: {
      name: "Kettlebell Deadlift",
      description:
        "With the kettlebell between your feet, hinge at the hips, grip the handle and lift it by extending your hips and knees.",
    },
    rack_pull: {
      name: "Rack Pull",
      description:
        "With the bar at knee height in the rack, extend your hips until you stand tall and lower with control.",
    },
    good_morning: {
      name: "Good Morning",
      description:
        "With the bar across your upper back, hinge forward by pushing your hips back and return to standing.",
    },
    back_extension: {
      name: "Back Extension",
      description:
        "On the back extension bench, lower your torso from the hips and raise it until your body is in a straight line.",
    },
    weighted_back_extension: {
      name: "Weighted Back Extension",
      description:
        "On the back extension bench holding a plate against your chest, lower your torso from the hips and raise it until your body is in a straight line.",
    },
    reverse_hyperextension: {
      name: "Reverse Hyperextension",
      description:
        "Lying face down on the machine, raise your legs behind you until they line up with your torso and lower with control.",
    },
    superman: {
      name: "Superman",
      description:
        "Lying face down, raise your arms and legs off the floor at the same time, hold briefly and lower.",
    },
    bird_dog: {
      name: "Bird Dog",
      description:
        "On all fours, extend one arm and the opposite leg while keeping your back neutral, then alternate sides.",
    },
    // Biceps
    barbell_curl: {
      name: "Barbell Curl",
      description:
        "Standing with the bar in an underhand grip, bend your elbows to curl it to your shoulders and lower with control.",
    },
    ez_bar_curl: {
      name: "EZ-Bar Curl",
      description:
        "Standing with the EZ bar, bend your elbows to curl it to your shoulders without swinging your body.",
    },
    preacher_curl: {
      name: "EZ-Bar Preacher Curl",
      description:
        "With your arms on the preacher bench, lower the bar until your elbows are almost straight and curl it up, squeezing your biceps.",
    },
    machine_preacher_curl: {
      name: "Machine Preacher Curl",
      description:
        "Seated with your arms on the pad, bend your elbows to curl the handles up and lower slowly.",
    },
    dumbbell_curl: {
      name: "Dumbbell Curl",
      description:
        "Standing with a dumbbell in each hand, bend your elbows while turning your palms up and lower with control.",
    },
    incline_dumbbell_curl: {
      name: "Incline Dumbbell Curl",
      description:
        "Seated on an incline bench with your arms hanging, bend your elbows to curl the dumbbells and lower slowly.",
    },
    hammer_curl: {
      name: "Hammer Curl",
      description:
        "Standing with your palms facing each other, bend your elbows to curl the dumbbells without rotating your wrists and lower with control.",
    },
    cross_body_hammer_curl: {
      name: "Cross-Body Hammer Curl",
      description:
        "With your palms facing each other, curl each dumbbell across your chest toward the opposite shoulder and lower with control.",
    },
    concentration_curl: {
      name: "Concentration Curl",
      description:
        "Seated with your elbow braced against your thigh, curl the dumbbell to your shoulder and lower slowly.",
    },
    spider_curl: {
      name: "Spider Curl",
      description:
        "Lying face down on an incline bench with your arms hanging, curl the dumbbells by bending your elbows.",
    },
    zottman_curl: {
      name: "Zottman Curl",
      description:
        "Curl the dumbbells up with your palms facing up, rotate them to face down at the top and lower slowly with an overhand grip.",
    },
    cable_curl: {
      name: "Cable Curl",
      description:
        "Standing facing the low cable, curl the bar or handle by bending your elbows and lower without losing tension.",
    },
    rope_hammer_curl: {
      name: "Rope Hammer Curl",
      description:
        "Standing facing the low cable with the rope, bend your elbows with your palms facing each other and lower with control.",
    },
    high_cable_curl: {
      name: "High Cable Curl",
      description:
        "Standing between two high cables with your arms out to the sides, bend your elbows to bring the handles toward your head.",
    },
    bayesian_curl: {
      name: "Bayesian Cable Curl",
      description:
        "Facing away from the low cable with your arm extended behind you, bend your elbow to bring the handle toward your shoulder and lower with control.",
    },
    drag_curl: {
      name: "Drag Curl",
      description:
        "Curl the bar up close to your body by driving your elbows back, without letting it leave your torso, and lower with control.",
    },
    band_curl: {
      name: "Band Curl",
      description:
        "Standing on the band, bend your elbows to curl your hands to your shoulders and lower with control.",
    },
    // Forearms and grip
    reverse_curl: {
      name: "Reverse Curl",
      description:
        "Standing with an overhand grip, bend your elbows to curl the bar to your shoulders and lower with control.",
    },
    wrist_curl: {
      name: "Wrist Curl",
      description:
        "With your forearms resting on a bench and your palms up, curl your wrists to raise the bar and lower slowly.",
    },
    reverse_wrist_curl: {
      name: "Reverse Wrist Curl",
      description:
        "With your forearms resting and your palms down, raise the backs of your hands by extending your wrists and lower slowly.",
    },
    plate_pinch: {
      name: "Plate Pinch",
      description:
        "Pinch two smooth plates together between your fingers and thumb and hold the grip for as long as you can.",
    },
    farmer_walk: {
      name: "Farmer's Walk",
      description:
        "Walk holding a heavy dumbbell in each hand, with your torso upright and your shoulders steady.",
    },
    suitcase_carry: {
      name: "Suitcase Carry",
      description:
        "Walk holding a heavy dumbbell in one hand without leaning your torso to either side.",
    },
    // Triceps
    triceps_pushdown: {
      name: "Triceps Pushdown",
      description:
        "Standing facing the high cable with the bar, push down until your elbows are straight, keeping them tucked at your sides.",
    },
    rope_pushdown: {
      name: "Rope Pushdown",
      description:
        "Standing facing the high cable with the rope, straighten your elbows and pull the ends of the rope apart at the bottom.",
    },
    reverse_grip_pushdown: {
      name: "Reverse-Grip Pushdown",
      description:
        "With the bar in an underhand grip, push down until your elbows are straight, keeping them tucked at your sides.",
    },
    single_arm_pushdown: {
      name: "Single-Arm Pushdown",
      description:
        "Standing facing the high cable with a single handle, push down with one arm until your elbow is straight and return with control.",
    },
    overhead_cable_triceps_extension: {
      name: "Overhead Cable Triceps Extension",
      description:
        "Facing away from the cable with the rope behind your head, straighten your elbows forward and up and return with control.",
    },
    overhead_dumbbell_triceps_extension: {
      name: "Overhead Dumbbell Triceps Extension",
      description:
        "Holding one dumbbell with both hands behind your head, straighten your elbows until your arms are straight and lower slowly.",
    },
    skull_crusher: {
      name: "Skull Crusher",
      description:
        "Lying on the bench with the EZ bar over your chest, bend your elbows to lower it toward your forehead and extend to return.",
    },
    dumbbell_skull_crusher: {
      name: "Dumbbell Skull Crusher",
      description:
        "Lying on the bench with the dumbbells over your chest, bend your elbows to lower them toward your head and extend to return.",
    },
    close_grip_bench_press: {
      name: "Close-Grip Bench Press",
      description:
        "Lying on the bench, lower the bar to your chest with your hands shoulder-width apart and press until your elbows are straight.",
    },
    jm_press: {
      name: "JM Press",
      description:
        "Lying on the bench, lower the bar toward your chin by bending your elbows forward and press back up.",
    },
    dumbbell_kickback: {
      name: "Dumbbell Triceps Kickback",
      description:
        "With your torso bent forward and your elbow tucked at your side, extend your arm back until it is straight and return.",
    },
    cable_kickback: {
      name: "Cable Triceps Kickback",
      description:
        "With your torso bent forward and your elbow tucked at your side, extend your arm back against the low cable and return with control.",
    },
    machine_triceps_extension: {
      name: "Machine Triceps Extension",
      description:
        "Seated in the machine, straighten your elbows by pushing the handles or bar down and return slowly.",
    },
    band_pushdown: {
      name: "Band Triceps Pushdown",
      description:
        "With the band anchored overhead, push down until your elbows are straight, keeping them tucked at your sides, and return with control.",
    },
    // Quads and squats
    back_squat: {
      name: "Back Squat",
      description:
        "With the bar across your upper back, lower by bending your hips and knees to your desired depth and stand back up by driving through the floor.",
    },
    front_squat: {
      name: "Front Squat",
      description:
        "With the bar resting on the front of your shoulders and your elbows high, lower with an upright torso and stand back up by driving through the floor.",
    },
    box_squat: {
      name: "Box Squat",
      description:
        "With the bar on your back, lower with control until you sit on a box and stand back up by driving through the floor.",
    },
    zercher_squat: {
      name: "Zercher Squat",
      description:
        "With the bar resting in the crooks of your elbows, lower with an upright torso to your desired depth and stand back up.",
    },
    overhead_squat: {
      name: "Overhead Squat",
      description:
        "With the bar held overhead on straight arms, squat down with an upright torso and stand back up.",
    },
    goblet_squat: {
      name: "Goblet Squat",
      description:
        "Holding a dumbbell against your chest with both hands, lower with an upright torso to your desired depth and stand back up.",
    },
    dumbbell_squat: {
      name: "Dumbbell Squat",
      description:
        "With a dumbbell in each hand at your sides, lower by bending your hips and knees and stand back up by driving through the floor.",
    },
    bodyweight_squat: {
      name: "Bodyweight Squat",
      description:
        "Standing with your feet shoulder-width apart, lower by bending your hips and knees and stand back up.",
    },
    band_squat: {
      name: "Band Squat",
      description:
        "Standing on the band and holding the ends at shoulder height, squat down and stand back up by driving through the floor.",
    },
    jump_squat: {
      name: "Jump Squat",
      description:
        "Lower into a squat and jump explosively; land with your knees bent and repeat.",
    },
    pistol_squat: {
      name: "Pistol Squat",
      description:
        "Balancing on one leg with the other extended in front of you, squat down deep and stand back up without assistance.",
    },
    sissy_squat: {
      name: "Sissy Squat",
      description:
        "Standing on your toes, lean your torso back while your knees travel forward, then rise back up.",
    },
    smith_machine_squat: {
      name: "Smith Machine Squat",
      description:
        "With the guided bar of the Smith machine across your upper back, lower by bending your hips and knees and stand back up by driving through the floor.",
    },
    hack_squat: {
      name: "Hack Squat",
      description:
        "With your back against the hack squat machine, lower by bending your knees and rise by pushing the platform away.",
    },
    pendulum_squat: {
      name: "Pendulum Squat",
      description:
        "In the pendulum squat machine, lower by bending your knees along the arc of the movement and rise by pushing the platform away.",
    },
    belt_squat: {
      name: "Belt Squat",
      description:
        "With the weight hanging from a belt at your hips, squat down with an upright torso and stand back up by driving through the floor.",
    },
    leg_press: {
      name: "Leg Press",
      description:
        "Seated in the leg press, lower the platform by bending your knees and push it back up until your legs are almost straight without locking them out.",
    },
    single_leg_press: {
      name: "Single-Leg Press",
      description:
        "With one foot on the platform, bend your knee to lower it and push back up without locking out your knee.",
    },
    high_foot_leg_press: {
      name: "High-Foot Leg Press",
      description:
        "Place your feet high on the platform, lower by bending your hips and knees and push until your legs are almost straight.",
    },
    leg_extension: {
      name: "Leg Extension",
      description:
        "Seated in the machine, straighten your knees to raise your legs and lower slowly.",
    },
    single_leg_extension: {
      name: "Single-Leg Extension",
      description:
        "Seated in the machine, straighten one knee to raise your leg and lower slowly.",
    },
    wall_sit: {
      name: "Wall Sit",
      description:
        "With your back against the wall and your knees at 90°, hold the position.",
    },
    reverse_nordic_curl: {
      name: "Reverse Nordic Curl",
      description:
        "Kneeling with an upright torso, lean back with your body in a straight line and return to the start.",
    },
    // Lunges and single-leg work
    lunge: {
      name: "Dumbbell Lunge",
      description:
        "With a dumbbell in each hand, step forward, lower until both knees are bent to about 90° and push back to the start.",
    },
    barbell_lunge: {
      name: "Barbell Lunge",
      description:
        "With the bar across your upper back, step forward, lower until both knees are bent to about 90° and push back to the start.",
    },
    walking_lunge: {
      name: "Walking Lunge",
      description:
        "Holding dumbbells, take a long step, lower your back knee toward the floor and keep moving forward, alternating legs.",
    },
    reverse_lunge: {
      name: "Reverse Lunge",
      description:
        "Holding dumbbells, step backward, lower until both knees are bent to about 90° and push back to the start.",
    },
    bodyweight_lunge: {
      name: "Bodyweight Lunge",
      description:
        "Step forward, lower until both knees are bent to about 90° and push back to the starting position.",
    },
    lateral_lunge: {
      name: "Lateral Lunge",
      description:
        "Take a long step to the side, bend that knee while keeping the other leg straight and push back to the start.",
    },
    curtsy_lunge: {
      name: "Curtsy Lunge",
      description:
        "Step one leg behind and across the other on a diagonal, lower until both knees are bent to about 90° and rise back up.",
    },
    bulgarian_split_squat: {
      name: "Bulgarian Split Squat",
      description:
        "With your rear foot on a bench and dumbbells in your hands, lower by bending your front knee and stand back up.",
    },
    split_squat: {
      name: "Split Squat",
      description:
        "With one foot forward and one back and without moving them, lower by bending both knees while holding dumbbells and stand back up.",
    },
    step_up: {
      name: "Step-Up",
      description:
        "Holding dumbbells, step onto a box or bench with your whole foot and lower with control; alternate legs.",
    },
    cossack_squat: {
      name: "Cossack Squat",
      description:
        "With a very wide stance, shift your weight onto one bent leg while the other stays straight, then alternate sides.",
    },
    sumo_squat: {
      name: "Sumo Squat",
      description:
        "With a wide stance and your toes turned out, hold a dumbbell between your legs and lower with an upright torso.",
    },
    // Hamstrings
    lying_leg_curl: {
      name: "Lying Leg Curl",
      description:
        "Lying face down on the machine, bend your knees to bring your heels toward your glutes and lower with control.",
    },
    seated_leg_curl: {
      name: "Seated Leg Curl",
      description:
        "Seated in the machine, bend your knees to bring your heels down and back and return slowly.",
    },
    standing_leg_curl: {
      name: "Standing Leg Curl",
      description:
        "Standing at the machine, bend one knee to bring your heel toward your glute and lower with control.",
    },
    nordic_curl: {
      name: "Nordic Hamstring Curl",
      description:
        "Kneeling with your ankles anchored, lower your torso forward as slowly as you can and use your hands to help you back up.",
    },
    stability_ball_leg_curl: {
      name: "Stability Ball Leg Curl",
      description:
        "Lying with your heels on the ball and your hips raised, bend your knees to roll the ball toward your glutes.",
    },
    glute_ham_raise: {
      name: "Glute-Ham Raise",
      description:
        "On the GHD with your feet secured, lower your torso with your body straight and come back up by bending your knees and extending your hips.",
    },
    // Glutes
    hip_thrust: {
      name: "Hip Thrust",
      description:
        "With your upper back on a bench and the bar across your hips, drive your hips up until your torso and thighs are in line.",
    },
    smith_machine_hip_thrust: {
      name: "Smith Machine Hip Thrust",
      description:
        "With your upper back on a bench and the Smith machine bar across your hips, drive your hips up until your torso and thighs are in line.",
    },
    machine_hip_thrust: {
      name: "Machine Hip Thrust",
      description:
        "Seated in the machine with your upper back supported, drive your hips up against the belt and lower with control.",
    },
    dumbbell_hip_thrust: {
      name: "Dumbbell Hip Thrust",
      description:
        "With your upper back on a bench and a dumbbell across your hips, drive your hips up and lower with control.",
    },
    single_leg_hip_thrust: {
      name: "Single-Leg Hip Thrust",
      description:
        "With your upper back on a bench and one leg raised, drive your hips up with your supporting foot and lower with control.",
    },
    glute_bridge: {
      name: "Glute Bridge",
      description:
        "Lying on your back with your knees bent, raise your hips until your torso and thighs are in line and lower with control.",
    },
    barbell_glute_bridge: {
      name: "Barbell Glute Bridge",
      description:
        "Lying on the floor with the bar across your hips, raise your hips until your torso and thighs are in line and lower with control.",
    },
    single_leg_glute_bridge: {
      name: "Single-Leg Glute Bridge",
      description:
        "Lying on your back with one leg extended in the air, raise your hips by pushing through your supporting foot and lower with control.",
    },
    frog_pump: {
      name: "Frog Pump",
      description:
        "Lying with the soles of your feet together and your knees out, raise your hips while squeezing your glutes and lower.",
    },
    donkey_kick: {
      name: "Donkey Kick",
      description:
        "On all fours, raise one bent leg toward the ceiling while squeezing your glute and lower without resting your knee.",
    },
    cable_glute_kickback: {
      name: "Cable Glute Kickback",
      description:
        "With an ankle strap attached to the low cable, extend your leg back by driving your hip through and return with control.",
    },
    machine_glute_kickback: {
      name: "Machine Glute Kickback",
      description:
        "Braced on the machine, push the platform back with one leg by extending your hip and return with control.",
    },
    cable_pull_through: {
      name: "Cable Pull-Through",
      description:
        "Facing away from the low cable with the rope between your legs, push your hips back and return to standing while squeezing your glutes.",
    },
    kettlebell_swing: {
      name: "Kettlebell Swing",
      description:
        "Drive the kettlebell up to chest height with an explosive hip extension and let it swing back between your legs.",
    },
    single_arm_kettlebell_swing: {
      name: "Single-Arm Kettlebell Swing",
      description:
        "Drive the kettlebell up to chest height with one hand using an explosive hip extension, without rotating your torso.",
    },
    // Abductors and adductors
    hip_abduction_machine: {
      name: "Hip Abduction Machine",
      description:
        "Seated in the machine, push your legs apart against the pads and return slowly.",
    },
    cable_hip_abduction: {
      name: "Cable Hip Abduction",
      description:
        "Standing with the ankle strap attached to the low cable, move your leg out to the side and return with control.",
    },
    side_lying_hip_abduction: {
      name: "Side-Lying Hip Abduction",
      description:
        "Lying on your side with your legs straight, raise your top leg without rotating your hips and lower with control.",
    },
    fire_hydrant: {
      name: "Fire Hydrant",
      description:
        "On all fours, raise one bent knee out to the side without rotating your hips and lower with control.",
    },
    banded_lateral_walk: {
      name: "Banded Lateral Walk",
      description:
        "With a band around your knees or ankles and your knees slightly bent, take side steps while keeping tension on the band.",
    },
    clamshell: {
      name: "Clamshell",
      description:
        "Lying on your side with your knees bent and a band around them, open your top knee without moving your pelvis.",
    },
    hip_adduction_machine: {
      name: "Hip Adduction Machine",
      description:
        "Seated in the machine, squeeze your legs together against the pads and return slowly.",
    },
    cable_hip_adduction: {
      name: "Cable Hip Adduction",
      description:
        "Standing with the ankle strap attached to the low cable, swing your leg across in front of the other and return with control.",
    },
    copenhagen_plank: {
      name: "Copenhagen Plank",
      description:
        "In a side plank with your top leg resting on a bench, raise your hips and hold the position.",
    },
    // Calves
    standing_calf_raise: {
      name: "Standing Calf Raise",
      description:
        "Standing in the machine with the pads on your shoulders, rise onto your toes and lower until your calves are stretched.",
    },
    seated_calf_raise: {
      name: "Seated Calf Raise",
      description:
        "Seated with your knees under the pads, rise onto your toes and lower until your calves are stretched.",
    },
    leg_press_calf_raise: {
      name: "Leg Press Calf Raise",
      description:
        "Seated in the leg press with the balls of your feet on the edge of the platform, push through your ankles and return slowly.",
    },
    smith_machine_calf_raise: {
      name: "Smith Machine Calf Raise",
      description:
        "Standing under the Smith machine bar with your toes on a platform, rise onto your toes and lower with control.",
    },
    dumbbell_calf_raise: {
      name: "Dumbbell Calf Raise",
      description:
        "Standing with a dumbbell in one hand and your toes on a step, rise onto your toes and lower with control.",
    },
    donkey_calf_raise: {
      name: "Donkey Calf Raise",
      description:
        "With your torso bent forward and the weight across your lower back, rise onto your toes and lower until your calves are stretched.",
    },
    bodyweight_calf_raise: {
      name: "Bodyweight Calf Raise",
      description:
        "Standing with your toes on a step, rise onto your toes and lower until your calves are stretched.",
    },
    single_leg_calf_raise: {
      name: "Single-Leg Calf Raise",
      description:
        "Standing on one leg with the ball of your foot on a step, rise onto your toes and lower until your calf is stretched.",
    },
    // Abs
    crunch: {
      name: "Crunch",
      description:
        "Lying with your knees bent, lift your shoulders off the floor by contracting your abs and lower with control.",
    },
    reverse_crunch: {
      name: "Reverse Crunch",
      description:
        "Lying on your back, bring your knees toward your chest, lifting your pelvis off the floor, and lower slowly.",
    },
    bicycle_crunch: {
      name: "Bicycle Crunch",
      description:
        "Lying down, bring one elbow toward the opposite knee while extending the other leg and alternate sides.",
    },
    sit_up: {
      name: "Sit-Up",
      description:
        "Lying with your knees bent, curl your torso up to a sitting position and lower with control.",
    },
    decline_sit_up: {
      name: "Decline Sit-Up",
      description:
        "Lying on a decline bench with your feet secured, curl your torso up to a sitting position and lower with control.",
    },
    v_up: {
      name: "V-Up",
      description:
        "Lying with your arms and legs extended, raise your torso and legs at the same time to touch your toes with your hands.",
    },
    leg_raise: {
      name: "Lying Leg Raise",
      description:
        "Lying on your back, raise your straight legs to vertical and lower without letting them touch the floor.",
    },
    flutter_kicks: {
      name: "Flutter Kicks",
      description:
        "Lying on your back with your legs raised, alternate small up-and-down kicks with your legs straight.",
    },
    hanging_leg_raise: {
      name: "Hanging Leg Raise",
      description:
        "Hanging from a bar, raise your straight legs to horizontal or higher and lower without swinging.",
    },
    hanging_knee_raise: {
      name: "Hanging Knee Raise",
      description:
        "Hanging from a bar, raise your knees toward your chest and lower without swinging.",
    },
    captains_chair_leg_raise: {
      name: "Captain's Chair Leg Raise",
      description:
        "With your forearms on the pads and your back against the backrest, raise your knees or straight legs and lower with control.",
    },
    toes_to_bar: {
      name: "Toes to Bar",
      description:
        "Hanging from a bar, raise your legs until your feet touch the bar and lower with control.",
    },
    cable_crunch: {
      name: "Cable Crunch",
      description:
        "Kneeling facing the high cable with the rope beside your head, curl your torso down, bringing your elbows toward your knees.",
    },
    machine_crunch: {
      name: "Machine Crunch",
      description:
        "Seated in the machine, curl your torso against the resistance by contracting your abs and return slowly.",
    },
    ab_wheel_rollout: {
      name: "Ab Wheel Rollout",
      description:
        "Kneeling, roll the wheel forward, extending your body without letting your lower back sag, and roll back.",
    },
    dragon_flag: {
      name: "Dragon Flag",
      description:
        "Lying on a bench and gripping its edge, raise your body in a straight line supported on your shoulders and lower it with control.",
    },
    // Isometrics and stability
    plank: {
      name: "Plank",
      description:
        "Supported on your forearms and toes, keep your body in a straight line.",
    },
    side_plank: {
      name: "Side Plank",
      description:
        "Supported on one forearm and the side of your foot, raise your hips and keep your body aligned.",
    },
    hollow_hold: {
      name: "Hollow Hold",
      description:
        "Lying with your arms and legs extended, raise your shoulders and legs off the floor while keeping your lower back pressed down.",
    },
    l_sit: {
      name: "L-Sit",
      description:
        "Supported between two bars, lift your body on straight arms with your legs straight out in front and hold the position.",
    },
    dead_bug: {
      name: "Dead Bug",
      description:
        "Lying with your arms and legs raised, lower the opposite arm and leg without lifting your lower back off the floor and alternate.",
    },
    mountain_climber: {
      name: "Mountain Climbers",
      description:
        "In a high plank, drive your knees toward your chest alternately and quickly.",
    },
    bear_crawl: {
      name: "Bear Crawl",
      description:
        "On all fours with your knees off the floor, move forward by advancing the opposite hand and foot together.",
    },
    // Obliques and rotation
    oblique_crunch: {
      name: "Oblique Crunch",
      description:
        "Lying with your knees bent and dropped to one side, lift your shoulder toward your hip by contracting your obliques.",
    },
    heel_touch: {
      name: "Heel Touch",
      description:
        "Lying with your knees bent, reach to one side to touch your heel with your hand and alternate.",
    },
    russian_twist: {
      name: "Russian Twist",
      description:
        "Seated with your torso leaned back and your feet raised, rotate your torso from side to side, bringing your hands beside your hip.",
    },
    weighted_russian_twist: {
      name: "Weighted Russian Twist",
      description:
        "Seated with your torso leaned back and your feet raised, rotate your torso from side to side holding a dumbbell with both hands.",
    },
    windshield_wiper: {
      name: "Floor Windshield Wiper",
      description:
        "Lying with your legs raised, lower both legs from side to side without letting your feet touch the floor.",
    },
    hanging_windshield_wiper: {
      name: "Hanging Windshield Wiper",
      description:
        "Hanging from a bar with your legs raised, swing them from side to side, controlling the movement with your abs.",
    },
    cable_woodchop: {
      name: "Cable Woodchop (High to Low)",
      description:
        "With the cable set high, rotate your torso, pulling the handle diagonally toward your opposite hip with your arms nearly straight.",
    },
    low_to_high_cable_woodchop: {
      name: "Cable Woodchop (Low to High)",
      description:
        "With the cable set low, rotate your torso, pulling the handle diagonally up and across to the opposite side with your arms nearly straight.",
    },
    pallof_press: {
      name: "Pallof Press",
      description:
        "Standing sideways to the cable with the handle at your chest, press your arms out in front without letting the cable rotate your torso.",
    },
    side_bend: {
      name: "Dumbbell Side Bend",
      description:
        "Standing with a dumbbell in one hand, bend your torso toward that side and return to upright.",
    },
    landmine_rotation: {
      name: "Landmine Rotation",
      description:
        "Standing and holding the end of the anchored bar with both hands, rotate your torso from side to side with your arms extended.",
    },
    // Neck
    neck_flexion: {
      name: "Plate Neck Flexion",
      description:
        "Lying on your back with your head off the bench and a light plate on your forehead, bring your chin toward your chest and return slowly.",
    },
    neck_extension: {
      name: "Plate Neck Extension",
      description:
        "Lying face down with your head off the bench and a light plate held at the back of your head, raise your head until it lines up with your body and lower slowly.",
    },
    neck_lateral_flexion: {
      name: "Neck Lateral Flexion",
      description:
        "Lying on your side with your head off the bench and a light plate held beside your temple, tilt your head toward your upper shoulder and lower slowly.",
    },
    // Olympic and functional lifts
    power_clean: {
      name: "Power Clean",
      description:
        "From the floor, extend your hips and knees explosively, shrug and catch the bar on your shoulders in a quarter squat.",
    },
    hang_power_clean: {
      name: "Hang Power Clean",
      description:
        "With the bar at knee height, drive with your hips, shrug and catch the bar on your shoulders in a quarter squat.",
    },
    clean_pull: {
      name: "Clean Pull",
      description:
        "From the floor, extend your hips and knees forcefully and shrug to pull the bar up without catching it.",
    },
    snatch: {
      name: "Snatch",
      description:
        "With a wide grip, bring the bar from the floor to overhead in one movement and catch it in a deep squat.",
    },
    power_snatch: {
      name: "Power Snatch",
      description:
        "With a wide grip, bring the bar from the floor to overhead in one movement and catch it in a quarter squat.",
    },
    clean_and_jerk: {
      name: "Clean and Jerk",
      description:
        "Bring the bar from the floor to your shoulders and then, with a leg drive, overhead.",
    },
    thruster: {
      name: "Thruster",
      description:
        "With the bar on your shoulders, squat down and, as you rise, press the bar overhead in one fluid movement.",
    },
    dumbbell_thruster: {
      name: "Dumbbell Thruster",
      description:
        "With a dumbbell on each shoulder, squat down and, as you rise, press them overhead in one fluid movement.",
    },
    dumbbell_snatch: {
      name: "Dumbbell Snatch",
      description:
        "With a dumbbell between your feet, extend your hips and knees and bring the dumbbell overhead in one movement.",
    },
    kettlebell_clean: {
      name: "Kettlebell Clean",
      description:
        "From a hip hinge, drive the kettlebell up and catch it resting on your forearm beside your shoulder.",
    },
    kettlebell_snatch: {
      name: "Kettlebell Snatch",
      description:
        "From a hip hinge, drive the kettlebell up in one movement until your arm is straight overhead.",
    },
    kettlebell_clean_and_press: {
      name: "Kettlebell Clean and Press",
      description:
        "Bring the kettlebell to your shoulder with a hip drive and press it overhead until your arm is straight.",
    },
    kettlebell_turkish_get_up: {
      name: "Turkish Get-Up",
      description:
        "Lying with the kettlebell held straight above your shoulder, stand up in several steps without lowering your arm and reverse the movement.",
    },
    medicine_ball_slam: {
      name: "Medicine Ball Slam",
      description:
        "Raise the ball overhead and slam it hard into the floor by bending your torso; pick it up and repeat.",
    },
    wall_ball: {
      name: "Wall Ball",
      description:
        "Holding a medicine ball at your chest, squat down and, as you rise, throw it at a target on the wall; catch it and repeat.",
    },
    // Plyometrics and conditioning
    box_jump: {
      name: "Box Jump",
      description:
        "From a short squat, jump onto a box, landing with your knees bent, and step down with control.",
    },
    broad_jump: {
      name: "Broad Jump",
      description:
        "Swing your arms, jump forward as far as you can and land with your knees bent.",
    },
    skater_jump: {
      name: "Skater Jump",
      description:
        "Jump sideways from one leg to the other, landing on one foot with your knee bent and the other foot crossed behind.",
    },
    burpee: {
      name: "Burpee",
      description:
        "Drop into a plank, do a push-up, jump your feet toward your hands and jump up with your arms overhead.",
    },
    battle_ropes: {
      name: "Battle Ropes",
      description:
        "With a rope in each hand and your knees bent, make fast waves with your arms while keeping your torso steady.",
    },
    jumping_jack: {
      name: "Jumping Jacks",
      description:
        "Jump while spreading your legs and raising your arms overhead, then jump back to the start.",
    },
    high_knees: {
      name: "High Knees",
      description:
        "Run in place, driving your knees as high as you can at a fast pace.",
    },
    jump_rope: {
      name: "Jump Rope",
      description:
        "Jump with small ankle bounces while turning the rope with your wrists.",
    },
    // Cardio
    running: {
      name: "Running",
      description:
        "Run outdoors at a steady pace with an upright torso and a relaxed stride.",
    },
    walking: {
      name: "Walking",
      description:
        "Walk at a brisk pace with an upright torso and relaxed arms.",
    },
    treadmill_run: {
      name: "Treadmill Run",
      description:
        "Run on the treadmill at a steady pace with an upright torso, without holding on to the rails.",
    },
    treadmill_walk: {
      name: "Treadmill Walk",
      description:
        "Walk on the treadmill at a brisk pace with an upright torso, without holding on to the rails.",
    },
    incline_treadmill_walk: {
      name: "Incline Treadmill Walk",
      description:
        "Walk on the treadmill at a steep incline with an upright torso, without holding on to the rails.",
    },
    stationary_bike: {
      name: "Stationary Bike",
      description: "Pedal seated with a straight back at a steady pace.",
    },
    assault_bike: {
      name: "Assault Bike",
      description:
        "Pedal while pushing and pulling the handles at the same time, increasing the pace to match the effort you want.",
    },
    rowing_machine: {
      name: "Rowing Machine",
      description:
        "Drive with your legs, lean your torso back and pull the handle to your abdomen; return in reverse order.",
    },
    elliptical: {
      name: "Elliptical",
      description:
        "Glide your feet along the path of the machine with an upright torso at a steady pace.",
    },
    stair_climber: {
      name: "Stair Climber",
      description:
        "Climb the machine's steps continuously with an upright torso, without leaning on the rails.",
    },
    ski_erg: {
      name: "Ski Erg",
      description:
        "Standing facing the machine, pull the handles down from overhead to your hips while bending your torso and knees.",
    },
    swimming: {
      name: "Swimming",
      description:
        "Swim at a steady pace, coordinating your arms, legs and breathing.",
    },
  },
  muscles: {
    chest: "Chest",
    front_delts: "Front delts",
    triceps: "Triceps",
    abs: "Abs",
    side_delts: "Side delts",
    traps: "Traps",
    lats: "Lats",
    biceps: "Biceps",
    forearms: "Forearms",
    glutes: "Glutes",
    quads: "Quads",
    hamstrings: "Hamstrings",
    calves: "Calves",
    obliques: "Obliques",
    rear_delts: "Rear delts",
    neck: "Neck",
    middle_delts: "Middle delts",
    erector_spinae: "Erector spinae",
    lower_back: "Lower back",
    quadriceps: "Quadriceps",
    upper_back: "Upper back",
    adductors: "Adductors",
    abductors: "Abductors",
    hip_flexors: "Hip flexors",
  },
  errors: {
    database: "Error setting up the database",
  },
};
