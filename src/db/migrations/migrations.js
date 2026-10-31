// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './20261012185351_init/migration.sql';
import m0001 from './20261013183136_exercise_description/migration.sql';
import m0002 from './20261013185219_drop_is_custom/migration.sql';
import m0003 from './20261013185229_exercise_key/migration.sql';
import m0004 from './20261013205837_muscle_group_neck/migration.sql';
import m0005 from './20261019180925_workout_set_timing/migration.sql';
import m0006 from './20261026180305_body_weight_unique_no_notes/migration.sql';
import m0007 from './20261030190203_drop_notes/migration.sql';

  export default {
    migrations: {
      "20261012185351_init": m0000,
"20261013183136_exercise_description": m0001,
"20261013185219_drop_is_custom": m0002,
"20261013185229_exercise_key": m0003,
"20261013205837_muscle_group_neck": m0004,
"20261019180925_workout_set_timing": m0005,
"20261026180305_body_weight_unique_no_notes": m0006,
"20261030190203_drop_notes": m0007
}
  }
  