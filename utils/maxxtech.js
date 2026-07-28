import axios from "axios";

const BASE = "https://api.maxxtech.co.ke";

const KEY =
    process.env.MAXXTECH_API_KEY ||
    "carlymaxx";

async function request(path, params = {}) {

    try {

        const { data } = await axios.get(
            `${BASE}${path}`,
            {
                params: {
                    ...params,
                    apikey: KEY
                },
                timeout: 30000
            }
        );

        if (!data.success) {
            throw new Error(data.message || "Request failed.");
        }

        return data.data;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "MaxxTech API request failed."
        );

    }

}

export default { request };
