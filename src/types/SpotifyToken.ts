interface SpotifyToken {
  access_token: string;
  tokenType: string;
  expires_in: number;
  expires_date?: Date;
}

export type { SpotifyToken };
