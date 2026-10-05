import Reply from "../utils/reply.js";
import NexOracle from "../utils/nexoracle.js";

// Each gfx variant needs a different number of text lines — this was
// confirmed per-endpoint rather than assumed, since Nexoracle isn't
// consistent about it across the family.
const TEXT_COUNT = {
    gfx: 2,
    gfx2: 2,
    gfx3: 2,
    gfx4: 2,
    gfx5: 3,
    gfx6: 3,
    gfx7: 1,
    gfx8: 2,
    gfx9: 1,
    gfx10: 1,
    gfx11: 1,
    gfx12: 1
};

export default {

    name: "gfx",

    aliases: Object.keys(TEXT_COUNT).filter(k => k !== "gfx"),

    description: "Create a GFX-style text logo image. 12 styles available (gfx, gfx2–gfx12).",

    category: "Media",

    usage: ".gfx <text> | <text2> | <text3 if needed>",

    async execute(message) {

        const variant = TEXT_COUNT[message.commandName] !== undefined
            ? message.commandName
            : "gfx";

        const needed = TEXT_COUNT[variant];

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide ${needed} line${needed > 1 ? "s" : ""} of text${needed > 1 ? ", separated by |" : ""}.

Example:
.${variant} ${["Kenya Ultra", "WhatsApp Bot", "v1.0"].slice(0, needed).join(" | ")}`
            );

        }

        const raw = message.args.join(" ");
        const parts = raw.split("|").map(s => s.trim());

        if (!parts[0]) {
            return Reply.error("Please provide at least the first line of text.");
        }

        const params = {};

        for (let i = 0; i < needed; i++) {
            params[`text${needed === 1 ? "" : i + 1}`] = parts[i] || "";
        }

        const path = variant === "gfx"
            ? "/image-creating/gfx"
            : `/image-creating/${variant}`;

        const url = NexOracle.buildUrl(path, params);

        return Reply.image({
            url,
            caption:
`🎨 *GFX Logo* (${variant})

🐺 Powered by Kenya-Ultra 👑`
        });

    }

};
