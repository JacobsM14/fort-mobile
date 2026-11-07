package expo.modules.weightreminder

import android.content.Context
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WeightReminderModule : Module() {

    private val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    override fun definition() = ModuleDefinition {
        Name("WeightReminder")

        Function("schedule") { options: ScheduleOptions ->
            ReminderScheduler.schedule(
                context,
                Reminder(
                    atMs = options.atMs.toLong(),
                    title = options.title,
                    text = options.text,
                    url = options.url,
                    channelName = options.channelName,
                ),
            )
        }

        Function("cancel") {
            ReminderScheduler.cancel(context)
        }
    }
}
