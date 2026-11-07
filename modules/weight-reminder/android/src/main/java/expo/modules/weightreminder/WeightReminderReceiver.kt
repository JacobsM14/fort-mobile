package expo.modules.weightreminder

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.app.NotificationChannelCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

private const val CHANNEL_ID = "weight_reminder"
private const val NOTIFICATION_ID = 2001
private const val OPEN_REQUEST_CODE = 2002

private fun showNotification(context: Context, reminder: Reminder) {
    val notifications = NotificationManagerCompat.from(context)
    // False without the notification permission, so notify never throws.
    if (!notifications.areNotificationsEnabled()) {
        return
    }

    // Left with its sound and vibration: this one is meant to be noticed.
    notifications.createNotificationChannel(
        NotificationChannelCompat.Builder(CHANNEL_ID, NotificationManagerCompat.IMPORTANCE_DEFAULT)
            .setName(reminder.channelName)
            .build()
    )

    // Opens the app through its deep link. setPackage keeps it inside this
    // app, so no other app can pick the link up.
    val open = PendingIntent.getActivity(
        context,
        OPEN_REQUEST_CODE,
        Intent(Intent.ACTION_VIEW, Uri.parse(reminder.url)).setPackage(context.packageName),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    notifications.notify(
        NOTIFICATION_ID,
        NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_weight)
            .setContentTitle(reminder.title)
            .setContentText(reminder.text)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(open)
            .build()
    )
}

class WeightReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val reminder = ReminderScheduler.load(context) ?: return
        showNotification(context, reminder)
        ReminderScheduler.schedule(
            context,
            reminder.copy(atMs = ReminderScheduler.nextWeekly(reminder.atMs, System.currentTimeMillis())),
        )
    }
}
