import axios from "axios";
import Reply from "../../utils/reply.js";

export default {

    name: "chucknorris",

    aliases: ["cn"],

    description: "Get a random Chuck Norris joke.",

    category: "Fun",

    usage: ".chucknorris",

    async execute() {

        try {

            const { data } = await axios.get(
                "https://api.chucknorris.io/jokes/random",
                { timeout: 10000 }
            );

            return Reply.text(`🥋 ${data.value}`);

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch a joke."
            );

        }

    }

};
