import axios from "axios";
import Reply from "../utils/reply.js";

export default {

    name: "shorturl",

    aliases: ["short", "shorten"],

    description: "Shorten a long URL.",

    category: "Utility",

    usage: ".shorturl <link>",

    async execute(message) {

        const url = message.args?.[0];

        if (!url || !/^https?:\/\//i.test(url)) {

            return Reply.error(
`Please provide a valid link starting with http:// or https://

Example:
.shorturl https://example.com/some/very/long/path`
            );

        }

        try {

            const { data } = await axios.get("https://is.gd/create.php", {
                params: {
                    format: "simple",
                    url
                },
                timeout: 15000
            });

            if (typeof data !== "string" || !data.startsWith("http")) {
                throw new Error(data || "Failed to shorten that link.");
            }

            return Reply.success(`Shortened link: ${data}`);

        } catch (err) {

            return Reply.error(
                err.response?.data ||
                err.message ||
                "Failed to shorten that link."
            );

        }

    }

};
