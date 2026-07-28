import MaxxTech from "../utils/maxxtech.js";
import Reply from "../utils/reply.js";

export default {

    name: "dadjoke",

    description: "Get a random dad joke.",

    category: "Fun",

    async execute() {

        try {

            const j = await MaxxTech.request("/dadjoke");

            return Reply.text(`👨 *Dad Joke*\n\n${j.joke}`);

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a dad joke."
            );

        }

    }

};
