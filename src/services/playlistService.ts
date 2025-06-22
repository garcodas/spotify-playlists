import { SpotifyPlaylist } from "@/types/SpotifyPlaylists";
import { SpotifyTrack } from "@/types/SpotifyTracks";
import axios from "axios";
import { getToken, getUserInfo, isTokenExpired } from "./authService";
import { UserProfile } from "@/types/UserResponse";

const token = getToken();
const userInfo: UserProfile | null = getUserInfo();
async function getPlaylistInfo(
  playlistId: string
): Promise<SpotifyPlaylist | null> {
  try {
    if (isTokenExpired()) {
      return null;
    }
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const playlistData = response.data;

    const playlist: SpotifyPlaylist = {
      id: playlistData.id,
      name: playlistData.name,
      description: playlistData.description,
      owner: playlistData.owner.display_name,
      tracksCount: playlistData.tracks.total,
    };

    return playlist;
  } catch (error) {
    return null;
  }
}

async function getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
  try {
    if (isTokenExpired()) {
      return [];
    }
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tracksData = response.data.items;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tracks: SpotifyTrack[] = tracksData.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
    }));

    return tracks;
  } catch (error) {
    return [];
  }
}

async function createPlaylist(name: string): Promise<string | null> {
  try {
    if (isTokenExpired()) {
      return null;
    }
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userInfo?.id}/playlists`,
      {
        name,
        public: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newPlaylistId = response.data.id;
    return newPlaylistId;
  } catch (error) {
    return null;
  }
}

async function addTracksToPlaylist(
  playlistId: string,
  trackUris: string[]
): Promise<boolean> {
  try {
    if (isTokenExpired()) {
      return false;
    }
    const chunkSize = 100;
    for (let i = 0; i < trackUris.length; i += chunkSize) {
      const chunk = trackUris.slice(i, i + chunkSize);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: chunk,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return true;
  } catch (error) {
    throw new Error("Failed to add tracks to playlist.");
  }
}

export {
  getPlaylistTracks,
  getPlaylistInfo,
  createPlaylist,
  addTracksToPlaylist,
};
