import axios from "axios";

const BASE =
    "https://api.cod3uchiha.com/search/yts";

class YouTubeSearch {

    async search(query, limit = 10) {

        if (!query)
            throw new Error("Search query is required.");

        const { data } = await axios.get(BASE, {
            params: {
                query,
                limit
            },
            timeout: 30000
        });

        if (!data.status) {
            throw new Error("Search failed.");
        }

        return data.result.map((video, index) => ({

            id: index + 1,

            title: video.title,

            url: video.url,

            duration: video.duration,

            seconds: video.seconds,

            views: video.views,

            uploaded: video.uploaded,

            thumbnail: video.thumbnail,

            author: video.author?.name || "Unknown"

        }));

    }

}

export default new YouTubeSearch();
