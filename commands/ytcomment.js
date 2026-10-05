import Reply from "../utils/reply.js";
import NexOracle from "../utils/nexoracle.js";

const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png";

export default {

    name: "ytcomment",

    description: "Create a fake YouTube comment image.",

    category: "Media",

    usage: ".ytcomment <username> | <comment text>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a username and comment text, separated by |.

Example:
.ytcomment InnoxentTech | Hi Guys, Subscribe to my Channel`
            );

        }

        const raw = message.args.join(" ");
        const [username, text] = raw.split("|").map(s => s?.trim());

        if (!username || !text) {

            return Reply.error(
`Please provide both a username and comment text, separated by |.

Example:
.ytcomment InnoxentTech | Hi Guys, Subscribe to my Channel`
            );

        }

        // Uses the sender's own WhatsApp profile picture as the
        // comment avatar when available, otherwise a generic
        // placeholder icon.
        const img = message.ppUrl || DEFAULT_AVATAR;

        const url = NexOracle.buildUrl("/image-creating/yt-comment", {
            username,
            text,
            img
        });

        return Reply.image({
            url,
            caption:
`💬 *Fake YouTube Comment*

🐺 Powered by Kenya-Ultra 👑`
        });

    }

};
