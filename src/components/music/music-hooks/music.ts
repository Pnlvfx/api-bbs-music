import { catchError } from "../../../lib/common";
import config from "../../../config/config";
import { YDdownload } from "../../../models/types/track";
import Track from "../../../models/Track";
import spotifyapis from "../../../lib/spotifyapis/spotifyapis";

const createTrack = async (song: YDdownload) => {
  const url = `${config.SERVER_URL}/music/${song.videoId}.mp3`;
  const duration = song.info.duration_ms;
  const artist = await spotifyapis.artist.getArtist(song.info.artists[0].id);
  const track = new Track({
    id: song.videoId,
    url,
    type: "default",
    content_type: "audio/mp3",
    duration,
    title: song.info.name,
    artist: song.info.artists[0].name,
    artistSpId: song.info.artists[0].id,
    album: song.info?.album.name,
    description: "",
    genre: artist.genres,
    date: song.info.album.release_date,
    artwork: song.info.album.images[0].url,
    file: song.file,
    spID: song.info.id,
    is_saved: true,
  });
  await track.save();
  return track;
};

const music = {
  saveMusic: async (song: YDdownload) => {
    try {
      const track = await createTrack(song);
      return track;
    } catch (err) {
      throw catchError(err);
    }
  },
};

export default music;
