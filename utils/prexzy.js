import axios from "axios";

// =========================
// Primary AI provider
// =========================
// https://prexzyapis.com/ai/chateverywhere?text=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "prexzy",
//   "message": "...",
//   "userId": "...",
//   "temperature": 0.5
// }

const BASE = "https://prexzyapis.com";

async function ask(text) {

    try {

        const { data } = await axios.get(
            `${BASE}/ai/chateverywhere`,
            {
                params: { text },
                timeout: 30000
            }
        );

        if (!data.status || !data.message) {
            throw new Error(data.message || "Request failed.");
        }

        return data.message;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Prexzy API request failed."
        );

    }

}

export default { ask };
