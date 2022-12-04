interface SpotifyArtistProps {
  external_urls: {
    spotify: "";
  };
  followers: { href: null; total: number };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImageProps[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}
