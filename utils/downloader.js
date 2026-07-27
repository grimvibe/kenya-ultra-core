import axios from "axios";

const API = "https://api.cod3uchiha.com/downloaders";

class Downloader {

    async ytmp3(url) {

        if (!url) {
            throw new Error("YouTube URL is required.");
        }

        const { data } = await axios.get(
            `${API}/ytmp3`,
            {
                params: {
                    url
                },
                timeout: 30000
            }
        );

        if (!data.status) {
            throw new Error("Failed to download audio.");
        }

        return data.data;

    }

    async ytmp4(url) {

        if (!url) {
            throw new Error("YouTube URL is required.");
        }

        const { data } = await axios.get(
            `${API}/ytmp4`,
            {
                params: {
                    url
                },
                timeout: 30000
            }
        );

        if (!data.status) {
            throw new Error("Failed to download video.");
        }

        return data.data;

    }

}

export default new Downloader();
