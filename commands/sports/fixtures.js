import MaxxTech from "../../utils/maxxtech.js";
import Reply from "../../utils/reply.js";

export default {

    name: "fixtures",

    description: "Get next fixtures and last results for a team (by TheSportsDB team ID). Usage: .fixtures <team-id>",

    category: "Sports",

    usage: ".fixtures 133602",

    async execute(message) {

        const id = (message.args || [])[0];

        if (!id) {

            return Reply.error(
`Please provide a team ID.

Example:
.fixtures 133602`
            );

        }

        try {

            const f = await MaxxTech.request(
                "/sports/fixtures",
                { id }
            );

            let text = "";

            if (f.next_fixtures?.length) {

                text += "📅 *Next Fixtures*\n\n";

                for (const m of f.next_fixtures) {

                    text +=
`${m.match}
🏟️ ${m.venue} | ${m.league}
🗓️ ${new Date(m.date).toLocaleString()}

`;

                }

            }

            if (f.last_results?.length) {

                text += "\n📊 *Last Results*\n\n";

                for (const m of f.last_results) {

                    text +=
`${m.match} — ${m.score}
🏟️ ${m.venue} | ${m.league}

`;

                }

            }

            if (!text) {
                return Reply.text("⚽ No fixtures or results found for that team ID.");
            }

            return Reply.text(text.trim());

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch fixtures."
            );

        }

    }

};
