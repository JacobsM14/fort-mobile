package expo.modules.workoutnotification

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ShowOptions : Record {
  @Field val title: String = ""
  @Field val text: String = ""
  // JavaScript numbers arrive as Double.
  @Field val startedAtMs: Double = 0.0
  @Field val channelName: String = ""
}
