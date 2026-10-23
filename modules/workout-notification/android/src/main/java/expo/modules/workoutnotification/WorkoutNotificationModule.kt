package expo.modules.workoutnotification

import android.content.Context
import androidx.core.app.NotificationChannelCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private const val CHANNEL_ID = "workout_ongoing_v1"
private const val NOTIFICATION_ID = 1001

class WorkoutNotificationModule : Module() {

    private val context: Context
        get() = requireNotNull(appContext.reactContext)

    override fun definition() = ModuleDefinition {
        Name("WorkoutNotification")

        Function("show") { options: ShowOptions ->
            // Low importance: it sits in the shade without sound or vibration.
            val channel = NotificationChannelCompat.Builder(CHANNEL_ID, NotificationManagerCompat.IMPORTANCE_LOW)
                .setName(options.channelName)
                .setShowBadge(false)
                .setVibrationEnabled(false)
                .setSound(null, null)
                .build()
            NotificationManagerCompat.from(context).createNotificationChannel(channel)

            // The system draws the chronometer from `when`, so it keeps counting
            // while the app is closed.
            val builder = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_workout)
                .setContentTitle(options.title)
                .setContentText(options.text)
                .setOngoing(true)
                .setWhen(options.startedAtMs.toLong())
                .setShowWhen(true)
                .setUsesChronometer(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setCategory(NotificationCompat.CATEGORY_WORKOUT)

            // False without the notification permission, so notify never throws.
            if (NotificationManagerCompat.from(context).areNotificationsEnabled()) {
                NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build())
            }
        }

        Function("dismiss") {
            NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID)
        }
    }
}