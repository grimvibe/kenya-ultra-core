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

    //==============================
    // YOUTUBE
    //==============================

    async ytmp3(url) {
        return await this.request("ytmp3", url);
    }

    async ytmp4(url) {
        return await this.request("ytmp4", url);
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

    //==============================
    // FACEBOOK
    //==============================

    async fb(url) {

        if (!url) {
            throw new Error("Facebook URL is required.");
        }

        try {

            const { data } = await axios.get(
                "https://api.siputzx.my.id/api/d/facebook",
                {
                    params: { url },
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "application/json"
                    },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error("Facebook download failed.");
            }

            return {
                title: data.data.title,
                duration: data.data.duration,
                thumbnail: data.data.thumbnail,
                downloads: data.data.downloads
            };

        } catch (err) {

            console.log(err.response?.data);

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "Facebook download failed."
            );

        }

    }

    //==============================
    // SOUNDCLOUD SEARCH
    //==============================

    async scSearch(query) {

        if (!query) {
            throw new Error("Search query is required.");
        }

        try {

            const { data } = await axios.get(
                "https://api.siputzx.my.id/api/s/soundcloud",
                {
                    params: { query },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data.length) {
                throw new Error("No SoundCloud results found.");
            }

            return data.data;

        } catch (err) {

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "SoundCloud search failed."
            );

        }

    }

    //==============================
    // SOUNDCLOUD DOWNLOAD
    //==============================

    async soundcloud(url) {

        if (!url) {
            throw new Error("SoundCloud URL is required.");
        }

        try {

            const { data } = await axios.get(
                "https://api.siputzx.my.id/api/d/soundcloud",
                {
                    params: { url },
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "application/json"
                    },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error("SoundCloud download failed.");
            }

            return data.data;

        } catch (err) {

            console.log(err.response?.data);

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "SoundCloud download failed."
            );

        }

    }

    //==============================
    // TIKTOK
    //==============================

    async tiktok(url) {

        if (!url) {
            throw new Error("TikTok URL is required.");
        }

        try {

            const { data } = await axios.get(
                "https://api.siputzx.my.id/api/d/tiktok/v2",
                {
                    params: { url },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error("TikTok download failed.");
            }

            return data.data;

        } catch (err) {

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "TikTok download failed."
            );

        }

    }

    //==============================
    // TWITTER / X
    //==============================

    async twitter(url) {

        if (!url) {
            throw new Error("Twitter/X URL is required.");
        }

        try {

            const { data } = await axios.get(
                "https://api.siputzx.my.id/api/d/twitter",
                {
                    params: { url },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error("Twitter download failed.");
            }

            return data.data;

        } catch (err) {

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "Twitter download failed."
            );

        }

    }

    //==============================
    // INSTAGRAM PROFILE (Ummy)
    //==============================

    async ummy(username) {

        if (!username) {
            throw new Error("Instagram username is required.");
        }

        try {

            const { data } = await axios.get(
                "https://api.siputzx.my.id/api/d/ummy",
                {
                    params: { url: username },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error("Instagram profile lookup failed.");
            }

            return data.data;

        } catch (err) {

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "Instagram profile lookup failed."
            );

        }

    }

    //==============================
    // CAPCUT
    //==============================

    async capcut(url) {

        if (!url) {
            throw new Error("CapCut URL is required.");
        }

        try {

            const { data } = await axios.get(
                "https://api.siputzx.my.id/api/d/capcut",
                {
                    params: { url },
                    timeout: 60000
                }
            );

            if (!data.status || !data.data) {
                throw new Error("CapCut download failed.");
            }

            return data.data;

        } catch (err) {

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                "CapCut download failed."
            );

        }

    }

}

export default new Downloader();
