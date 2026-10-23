// Same fields as ShowOptions.kt.
export interface ShowOptions {
  url: string;
  title: string;
  text: string;
  startedAtMs: number;
  // The name Android shows for this kind of notification in its settings.
  channelName: string;
}
