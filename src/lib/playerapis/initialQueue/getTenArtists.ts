import { catchError } from "../../../lib/common";
import spotifyapis from "../../../lib/spotifyapis/spotifyapis";
import { IUser } from "../../../models/types/user";
import { LikedArtistProps } from "../../../models/types/user";

export const getTenArtists = async (user: IUser) => {
  try {
    const similarArtists: LikedArtistProps[] = user.liked_artists;
    await Promise.all(
      user.liked_artists.map(async (artist) => {
        const similars = await spotifyapis.artist.getRelatedArtist(artist.spID);
        similars.sort((a, b) => {
          return b.popularity - a.popularity;
        });
        similars.map((similar) => {
          const exist = similarArtists.find((_) => _.spID === similar.id);
          if (exist) return;
          similarArtists.push({
            name: similar.name,
            spID: similar.id,
          });
        });
      })
    );
    similarArtists.length = 10;
    return similarArtists;
  } catch (err) {
    throw catchError(err);
  }
};
