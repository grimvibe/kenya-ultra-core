import MaxxTech from "../../utils/maxxtech.js";
import Reply from "../../utils/reply.js";

export default {

    name: "bored",

    description: "Get a random activity suggestion.",

    category: "Fun",

    async execute() {

        try {

            const b = await MaxxTech.request("/fun/bored");

            return Reply.text(
`🎯 *Something to do*

${b.activity}

👥 Participants: ${b.participants}
💸 Price: ${b.price === 0 ? "Free" : b.price}
🧩 ${b.accessibility}`
            );

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch an activity."
            );

        }

    }

};
