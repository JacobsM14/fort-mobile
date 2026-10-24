package expo.modules.workoutnotification

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.app.NotificationChannelCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private const val CHANNEL_ID = "workout_ongoing_v2"
private const val NOTIFICATION_ID = 1001

class WorkoutNotificationModule : Module() {

    private val context: Context
        get() = Exceptions.ReactContextLost()

    override fun definition() = ModuleDefinition {
        Name("WorkoutNotification")

        Function("show") { options: ShowOptions ->
            // Low importance: it sits in the shade without sound or vibration.
            val channel = NotificationChannelCompat.Builder(CHANNEL_ID, NotificationManagerCompat.IMPORTANCE_DEFAULT)
                .setName(options.channelName)
                .setShowBadge(false)
                .setVibrationEnabled(false)
                .setSound(null, null)
                .build()
            NotificationManagerCompat.from(context).createNotificationChannel(channel)

            // Opens the workout through its deep link. setPackage keeps it
            // inside this app, so no other app can pick the link up.
            val openWorkout = PendingIntent.getActivity(
                context,
                0,
                Intent(Intent.ACTION_VIEW, Uri.parse(options.url))
                    .setPackage(context.packageName),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // The system draws the chronometer from `when`, so it keeps counting
            // while the app is closed.
            val builder = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_workout)
                .setContentTitle(options.title)
                .setContentText(options.text)
                .setWhen(options.startedAtMs.toLong())
                .setShowWhen(true)
                .setUsesChronometer(true)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setCategory(NotificationCompat.CATEGORY_WORKOUT)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setContentIntent(openWorkout)

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