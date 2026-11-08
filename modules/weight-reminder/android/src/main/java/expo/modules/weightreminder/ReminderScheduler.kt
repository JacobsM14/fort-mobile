package expo.modules.weightreminder

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import java.util.Calendar

private const val PREFERENCES = "weight_reminder"
private const val KEY_AT_MS = "at_ms"
private const val KEY_TITLE = "title"
private const val KEY_TEXT = "text"
private const val KEY_URL = "url"
private const val KEY_CHANNEL_NAME = "channel_name"
private const val ALARM_REQUEST_CODE = 2001
private const val DAYS_IN_WEEK = 7

// Shared by the module and the two receivers.
// It handles scheduling, cancelling, and loading reminders.
// It also calculates the next weekly occurrence of a reminder.
// We use SharedPreferences because the receivers run without JavaScript
// and can't read the app's database.
// (device restarts reset alarms, so we need to reload the reminder to reschedule it)
object ReminderScheduler {

    fun schedule(context: Context, reminder: Reminder) {
        save(context, reminder)
        context.getSystemService(AlarmManager::class.java)
            .setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, reminder.atMs, alarmIntent(context))
    }

    fun cancel(context: Context) {
        context.getSystemService(AlarmManager::class.java).cancel(alarmIntent(context))
        preferences(context).edit().clear().apply()
    }

    fun load(context: Context): Reminder? {
        val preferences = preferences(context)
        if (!preferences.contains(KEY_AT_MS)) {
            return null
        }
        return Reminder(
            atMs = preferences.getLong(KEY_AT_MS, 0L),
            title = preferences.getString(KEY_TITLE, "") ?: "",
            text = preferences.getString(KEY_TEXT, "") ?: "",
            url = preferences.getString(KEY_URL, "") ?: "",
            channelName = preferences.getString(KEY_CHANNEL_NAME, "") ?: "",
        )
    }

    // After fromMs, find the next weekly occurrence that is still ahead of nowMs.
    fun nextWeekly(fromMs: Long, nowMs: Long): Long {
        val calendar = Calendar.getInstance().apply { timeInMillis = fromMs }
        // Because of inexact alarms, or the phone being off when it was due,
        // we check that the calculated time is still ahead of nowMs.
        while (calendar.timeInMillis <= nowMs) {
            calendar.add(Calendar.DAY_OF_YEAR, DAYS_IN_WEEK)
        }
        return calendar.timeInMillis
    }

    private fun preferences(context: Context) =
        context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)

    private fun save(context: Context, reminder: Reminder) {
        preferences(context).edit()
            .putLong(KEY_AT_MS, reminder.atMs)
            .putString(KEY_TITLE, reminder.title)
            .putString(KEY_TEXT, reminder.text)
            .putString(KEY_URL, reminder.url)
            .putString(KEY_CHANNEL_NAME, reminder.channelName)
            .apply()
    }

    // The same request code and intent every time: that is how cancel finds
    // the alarm that schedule set.
    private fun alarmIntent(context: Context) = PendingIntent.getBroadcast(
        context,
        ALARM_REQUEST_CODE,
        Intent(context, WeightReminderReceiver::class.java),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
}
