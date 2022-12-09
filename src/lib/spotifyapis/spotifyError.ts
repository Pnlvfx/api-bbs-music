import spotifyapis from "./spotifyapis";

const spotifyError = async (status: number, data: any) => {
    if (status === 401) {
        await spotifyapis.getAccessToken();
        throw new Error()
    } else {
        throw new Error(JSON.stringify(data))
    }
}

export default spotifyError;
