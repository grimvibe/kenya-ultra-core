import axios from "axios";
import Reply from "../utils/reply.js";

// Common shorthand -> CoinGecko coin id, so people can type
// ".crypto btc" instead of the full slug.
const ALIASES = {
    btc: "bitcoin",
    eth: "ethereum",
    bnb: "binancecoin",
    sol: "solana",
    xrp: "ripple",
    doge: "dogecoin",
    ada: "cardano",
    ton: "the-open-network",
    trx: "tron",
    usdt: "tether"
};

export default {

    name: "crypto",

    aliases: ["price", "coin"],

    description: "Check the current price of a cryptocurrency.",

    category: "Utility",

    usage: ".crypto <coin name or symbol>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a coin name or symbol.

Example:
.crypto btc`
            );

        }

        const input = message.args[0].toLowerCase();
        const coinId = ALIASES[input] || input;

        try {

            const { data } = await axios.get(
                "https://api.coingecko.com/api/v3/simple/price",
                {
                    params: {
                        ids: coinId,
                        vs_currencies: "usd,ngn",
                        include_24hr_change: true
                    },
                    timeout: 15000
                }
            );

            const info = data[coinId];

            if (!info) {
                return Reply.error(
                    `Couldn't find a coin matching "${message.args[0]}". Try the full name, e.g. "bitcoin".`
                );
            }

            const change = info.usd_24h_change ?? 0;
            const arrow = change >= 0 ? "🟢▲" : "🔴▼";

            return Reply.success(
`*${coinId.toUpperCase()}*

💵 $${info.usd?.toLocaleString() ?? "N/A"}
₦ ₦${info.ngn?.toLocaleString() ?? "N/A"}

${arrow} 24h: ${change.toFixed(2)}%`
            );

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch that coin's price."
            );

        }

    }

};
