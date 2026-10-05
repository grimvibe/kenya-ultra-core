import axios from "axios";
import NexOracle from "../utils/nexoracle.js";
import Reply from "../utils/reply.js";

const LABELS = {
    gbwa: "GBWhatsApp",
    waplus: "WhatsApp Plus",
    ogwa: "OGWhatsApp",
    anwa: "ANWhatsApp",
    fmwa: "FMWhatsApp",
    yowa: "YoWhatsApp",
    aerowa: "AeroWhatsApp",
    goldwa: "WhatsApp Gold",
    karinawa: "Karina WhatsApp"
};

export default {

    name: "wamod",

    description: "Get the latest download links for popular WhatsApp mods.",

    category: "Download",

    usage: ".wamod",

    async execute(message) {

        try {

            const url = NexOracle.buildUrl("/downloader/wamod");

            const { data } = await axios.get(url);

            const result = data?.result;

            if (!result) {
                throw new Error("No mod links returned.");
            }

            const lines = Object.entries(result)
                .filter(([key]) => LABELS[key])
                .map(([key, link]) => `📱 *${LABELS[key]}*\n${link}`)
                .join("\n\n");

            return Reply.text(
`📦 *WhatsApp Mods*

${lines}

━━━━━━━━━━━━━━

⚠️ These are unofficial, third-party WhatsApp clients, not affiliated with WhatsApp/Meta. Using them can violate WhatsApp's Terms of Service and risks account bans — use at your own risk.

🐺 Powered by Kenya-Ultra 👑`
            );

        } catch (err) {

            console.error("wamod error:", err.message);

            return Reply.error(
                err.message ||
                "Failed to fetch WhatsApp mod links."
            );

        }

    }

};
