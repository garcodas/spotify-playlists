export interface Song {
  name: string;
}

export interface FormValues {
  playlist_url: string;
  songs?: Song[];
}
