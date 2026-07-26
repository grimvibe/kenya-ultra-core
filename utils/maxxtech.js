import axios from "axios";

const BASE_URL = "https://api.maxxtech.co.ke";
const API_KEY = "carlymaxx";

class MaxxTech {

    async downloader(url) {

        if (!url) {
            throw new Error("URL is required.");
        }

        const { data } = await axios.get(
            `${BASE_URL}/downloader`,
            {
                params: {
                    url,
                    apikey: API_KEY
                },
                timeout: 30000
            }
        );

        if (!data.success) {
            throw new Error(data.message || "Download failed.");
        }

        return data.data;
    }

}

export default new MaxxTech();
