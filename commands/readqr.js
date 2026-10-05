import axios from "axios";
import Reply from "../utils/reply.js";
import NexOracle from "../utils/nexoracle.js";

export default {

    name: "readqr",

    description: "Decode a QR code image into text.",

    category: "Media",

    usage: ".readqr <direct image URL>",

    async execute(message) {

        const imgUrl = message.args?.[0];

        if (!imgUrl || !/^https?:\/\//i.test(imgUrl)) {

            return Reply.error(
`Please provide a direct link to a QR code image.

Example:
.readqr https://i.ibb.co/1dhvVgL/qr-code.png

Note: this needs a public image URL, not a WhatsApp photo — upload the image somewhere first (e.g. ibb.co) and paste the link.`
            );

        }

        const url = NexOracle.buildUrl("/image-creating/read-qr", {
            img: imgUrl
        });

        try {

            const { data } = await axios.get(url, { timeout: 20000 });

            const decoded =
                data.result || data.text || data.data || data.content;

            if (!data || data.status === 404 || !decoded) {
                return Reply.error("Couldn't read a QR code from that image.");
            }

            return Reply.success(`Decoded: ${decoded}`);

        } catch (err) {

            return Reply.error(
                err.message || "Failed to decode that QR code."
            );

        }

    }

};
