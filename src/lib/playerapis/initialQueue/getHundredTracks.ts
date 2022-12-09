import { IUser, LikedArtistProps } from "../../../models/types/user";
import { catchError } from "../../../lib/common";
import spotifyapis from "../../../lib/spotifyapis/spotifyapis";

export const getHundredTracks = async (tenArtists: LikedArtistProps[], user: IUser) => {
  try {
    let tracks: SpotifyTrackProps[] = [];
    await Promise.all(
      tenArtists.map(async (liked_artist) => {
        const artist_tracks = await spotifyapis.artist.getTopTrack(
          liked_artist.spID,
          user.countryCode
        );
        artist_tracks.sort((a, b) => {
          return b.popularity - a.popularity;
        });
        artist_tracks.length = 10;
        const arr = Array.from(new Set(tracks.concat(artist_tracks)));
        tracks = arr;
      })
    );
    return tracks;
  } catch (err) {
    throw catchError(err);
  }
};
