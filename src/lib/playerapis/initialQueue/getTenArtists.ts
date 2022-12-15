import { ArtistProps } from "../../../models/types/artist";
import { catchError } from "../../../lib/common";
import spotifyapis from "../../../lib/spotifyapis/spotifyapis";
import artist from "../../../components/artist/artist-hooks/artist";
import Artist from "../../../models/Artist";

export const getTenArtists = async (likedArtists: ArtistProps[]) => {
  try {
    const similarArtists = likedArtists;
    await Promise.all(
      likedArtists.map(async (liked_artist) => {
        const similars = await spotifyapis.artist.getRelatedArtist(
          liked_artist.spID
        );
        similars.sort((a, b) => {
          return b.popularity - a.popularity;
        });
        similars.map(async (similar) => {
          const exist = similarArtists.find((_) => _.spID === similar.id);
          if (exist) return;
          let _artist = await Artist.findOne({ spID: similar.id });
          if (!_artist) _artist = await artist.createArtist(similar);
          similarArtists.push(_artist);
        });
      })
    );
    similarArtists.length = 10;
    return similarArtists;
  } catch (err) {
    throw catchError(err);
  }
};
