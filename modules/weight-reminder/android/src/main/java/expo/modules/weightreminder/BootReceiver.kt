package expo.modules.weightreminder

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

// Android clears every alarm when the phone restarts. A reminder that was due
// while it was off is not shown late: it goes to the next week.
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED &&
            intent.action != Intent.ACTION_MY_PACKAGE_REPLACED
        ) {
            return
        }
        val reminder = ReminderScheduler.load(context) ?: return
        ReminderScheduler.schedule(
            context,
            reminder.copy(atMs = ReminderScheduler.nextWeekly(reminder.atMs, System.currentTimeMillis())),
        )
    }
}
