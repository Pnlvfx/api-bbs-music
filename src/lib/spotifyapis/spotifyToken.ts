import spotifyapis from "./spotifyapis";

const spotifyToken = async () => {
    try {
        //await spotifyapis.getAccessToken();
        setInterval(async () => {
            try {
                await spotifyapis.getAccessToken();
            } catch (err) {
                console.log(err);
            }
        }, 3600000);
    } catch (err) {
        console.log(err);
    }
}

export default spotifyToken;