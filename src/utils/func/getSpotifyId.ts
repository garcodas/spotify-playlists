function getSpotifyId(url: string): string | null {
  const playlistRegex = /playlist\/([a-zA-Z0-9]+)/;
  const trackRegex = /track\/([a-zA-Z0-9]+)/;

  const playlistMatch = url.match(playlistRegex);
  const trackMatch = url.match(trackRegex);

  if (playlistMatch && playlistMatch[1]) {
    return playlistMatch[1];
  } else if (trackMatch && trackMatch[1]) {
    return trackMatch[1];
  } else {
    return null;
  }
}

export { getSpotifyId };
