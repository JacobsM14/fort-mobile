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

// Shared by the module and the two receivers. The reminder is kept in
// SharedPreferences because the receivers run without JavaScript: when the
// alarm goes off, and after the phone restarts, which clears every alarm.
object ReminderScheduler {

    fun schedule(context: Context, reminder: Reminder) {
        save(context, reminder)
        // Inexact: it may come a few minutes late while the phone is dozing,
        // which doesn't matter here, and it needs no special permission.
        context.getSystemService(AlarmManager::class.java)
            .setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, reminder.atMs, alarmIntent(context))
    }

    fun cancel(context: Context) {
        context.getSystemService(AlarmManager::class.java).cancel(alarmIntent(context))
        preferences(context).edit().clear().apply()
    }

    // Null when no reminder is set.
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

    // The first weekly repeat of fromMs that is still ahead of nowMs. A day is
    // added on the calendar, not 24 hours in milliseconds, so the reminder
    // keeps its local hour across a clock change. It loops because the alarm
    // may come late, or the phone may have been off when it was due.
    fun nextWeekly(fromMs: Long, nowMs: Long): Long {
        val calendar = Calendar.getInstance().apply { timeInMillis = fromMs }
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
