import { catchError } from "../../../lib/common";
import Artist from "../../../models/Artist";

const artist = {
    createArtist: async (spArtist: SpotifyArtistProps) => {
        try {
            const artist = new Artist({
                followers: {
                  total: spArtist.followers.total,
                },
                genres: spArtist.genres,
                spID: spArtist.id,
                images: spArtist.images,
                name: spArtist.name,
                popularity: spArtist.popularity,
                type: spArtist.type,
              });
              return await artist.save();
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default artist;
