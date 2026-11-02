package expo.modules.weightreminder

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Context
import expo.modules.kotlin.exception.Exceptions


class WeightReminderModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("WeightReminder")

    Function("schedule") { options: ScheduleOptions ->
      ReminderScheduler.schedule(context, Reminder(options.atMs.toLong(), options.title, options.text, options.url, options.channelName))
    }
    Function("cancel") { ReminderScheduler.cancel(context) }
  }
}
