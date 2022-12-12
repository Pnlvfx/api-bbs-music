import spotifyapis from "./spotifyapis";
import spotify from "./spotifyConfig";

const spotifyError = async (status: number, data: any) => {
    if (status === 401) {
        const newToken = await spotifyapis.getAccessToken();
        spotify.refreshHeaders(newToken.access_token); 
        throw new Error('New access token')
    } else {
        throw new Error(JSON.stringify(data))
    }
}

export default spotifyError;
