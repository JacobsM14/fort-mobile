// Same fields as ScheduleOptions.kt.
export interface ScheduleOptions {
  // When the next reminder goes off, in milliseconds since the epoch.
  atMs: number;
  title: string;
  text: string;
  url: string;
  // The name Android shows for this kind of notification in its settings.
  channelName: string;
}
