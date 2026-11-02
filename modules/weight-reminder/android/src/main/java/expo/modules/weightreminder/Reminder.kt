package expo.modules.weightreminder

data class Reminder(
    val atMs: Long, val title: String, val text: String,
    val url: String, val channelName: String
)
