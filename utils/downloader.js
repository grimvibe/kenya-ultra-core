import axios from "axios";

const API = "https://api.cod3uchiha.com/downloaders";

class Downloader {

    async request(endpoint, url) {

        if (!url) {
            throw new Error("URL is required.");
        }

        try {

            const { data } = await axios.get(
                `${API}/${endpoint}`,
                {
                    params: { url },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error(
                    data.message || "Download failed."
                );
            }

            return data.data;

        } catch (err) {

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "Downloader failed."
            );

        }

    }

    async ytmp3(url) {

        return await this.request(
            "ytmp3",
            url
        );

    }

    async ytmp4(url) {

        return await this.request(
            "ytmp4",
            url
        );

    }

}

export default new Downloader();
