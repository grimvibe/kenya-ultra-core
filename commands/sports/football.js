import MaxxTech from "../../utils/maxxtech.js";
import Reply from "../../utils/reply.js";

export default {

    name: "football",

    aliases: ["epl", "scores"],

    description: "Get recent/upcoming football fixtures for a league. Usage: .football [league]",

    category: "Sports",

    usage: ".football epl",

    async execute(message) {

        const league =
            (message.args || [])[0]?.toLowerCase() || "epl";

        try {

            const f = await MaxxTech.request(
                "/sports/football",
                { league }
            );

            const events = f.events || [];

            if (!events.length) {

                return Reply.text(
                    `⚽ No ${f.league || league.toUpperCase()} fixtures found right now.`
                );

            }

            let text = `⚽ *${f.league} Fixtures*\n\n`;

            for (const e of events.slice(0, 10)) {

                const scoreLine =
                    e.status === "Scheduled"
                        ? "vs"
                        : `${e.home_score} - ${e.away_score}`;

                text +=
`${e.home_team} ${scoreLine} ${e.away_team}
📍 ${e.venue} | 🕒 ${e.status}

`;

            }

            return Reply.text(text.trim());

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch football fixtures."
            );

        }

    }

};
