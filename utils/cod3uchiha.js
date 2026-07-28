import axios from "axios";

// =========================
// Fallback AI provider
// =========================
// https://api.cod3uchiha.com/ai/gpt5?text=...
//
// Example response:
// {
//   "status": true,
//   "statusCode": 200,
//   "creator": "cod3uchiha",
//   "result": "...",
//   "citations": []
// }

const BASE = "https://api.cod3uchiha.com";

async function ask(text) {

    try {

        const { data } = await axios.get(
            `${BASE}/ai/gpt5`,
            {
                params: { text },
                timeout: 30000
            }
        );

        if (!data.status || !data.result) {
            throw new Error(data.message || "Request failed.");
        }

        return data.result;

    } catch (err) {

        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Cod3Uchiha API request failed."
        );

    }

}

export default { ask };
