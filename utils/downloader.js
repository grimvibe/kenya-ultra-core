import axios from "axios";
import yts from "yt-search";

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

    async fb(url) {

        if (!url) {
            throw new Error("Facebook URL is required.");
        }

        try {

            const { data } = await axios.get(
                `${API}/facebook`,
                {
                    params: { url },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error(
                    data.message || "Facebook download failed."
                );
            }

            return data.data;

        } catch (err) {

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "Facebook downloader failed."
            );

        }

    }

    async yts(query) {

        if (!query) {
            throw new Error("Search query is required.");
        }

        const { videos } = await yts(query);

        return {

            result: videos.map(video => ({

                title: video.title,

                url: video.url,

                thumbnail: video.thumbnail,

                duration: video.timestamp,

                author: {
                    name: video.author?.name || "Unknown"
                }

            }))

        };

    }

}

export default new Downloader();
