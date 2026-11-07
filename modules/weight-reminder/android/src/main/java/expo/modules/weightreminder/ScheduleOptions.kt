package expo.modules.weightreminder

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ScheduleOptions : Record {
    // JavaScript numbers arrive as Double.
    @Field val atMs: Double = 0.0
    @Field val title: String = ""
    @Field val text: String = ""
    @Field val url: String = ""
    @Field val channelName: String = ""
}
