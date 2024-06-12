interface UserImages {
  height: number;
  url: string;
  width: number;
}
interface UserProfile {
  id: string;
  display_name: string;
  images: UserImages[];
  uri: string;
}

export type { UserImages, UserProfile };
