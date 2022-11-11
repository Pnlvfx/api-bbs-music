import Artist from "../../../models/Artist";

const artist = {
    new: async (name: string) => {
        const _artist = new Artist({
            name
        });
        return await _artist.save()
    }
}

export default artist;
