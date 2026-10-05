import Reply from "../utils/reply.js";

export default {

    name: "qr",

    aliases: ["qrcode"],

    description: "Generate a QR code from text or a link.",

    category: "Utility",

    usage: ".qr <text or link>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide text or a link to encode.

Example:
.qr https://kenya-ultra.com`
            );

        }

        const text = message.args.join(" ");

        const qrUrl =
            `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

        return Reply.image({
            url: qrUrl,
            caption:
`📱 *QR Code Generated*

🐺 Powered by Kenya-Ultra 👑`
        });

    }

};
