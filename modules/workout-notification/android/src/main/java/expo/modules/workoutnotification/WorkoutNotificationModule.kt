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
            // 1. Canal (importancia baja, sin sonido ni vibración)
            val channel = NotificationChannelCompat.Builder(CHANNEL_ID, NotificationManagerCompat.IMPORTANCE_LOW)
                .setName(options.channelName)
                .setShowBadge(false)
                .setVibrationEnabled(false)
                .setSound(null, null)
                .build()
            NotificationManagerCompat.from(context).createNotificationChannel(channel)

            // 2. Notificación (aquí van el cronómetro y el resto)
            val builder = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(options.title)
                .setContentText(options.text)
                .setOngoing(true)
                .setWhen(options.startedAtMs)
                .setShowWhen(true)
                .setUsesChronometer(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setCategory(NotificationCompat.CATEGORY_WORKOUT)

            // 3. Publicar
            if (NotificationManagerCompat.from(context).areNotificationsEnabled()) {
                NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build())
            }
        }

        Function("dismiss") {
            NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID)
        }
    }
}