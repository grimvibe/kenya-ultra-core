import NexOracle from "../utils/nexoracle.js";
import Reply from "../utils/reply.js";

export default {

    name: "resize",

    description: "Resize an image from a URL.",

    category: "Media",

    usage: ".resize <image_url> [width] [height]",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide an image URL.

Example:
.resize https://example.com/photo.jpg 200 200`
            );

        }

        const [img, widthArg, heightArg] = message.args;

        if (!/^https?:\/\//i.test(img)) {

            return Reply.error(
`Please provide a valid image URL (starting with http:// or https://).

Example:
.resize https://example.com/photo.jpg 200 200`
            );

        }

        const width = Number(widthArg) || 100;
        const height = Number(heightArg) || 100;

        const url = NexOracle.buildUrl("/image-processing/resize", {
            img,
            width,
            height
        });

        return Reply.image({
            url,
            caption:
`🖼️ *Image Resized* (${width}x${height})

🐺 Powered by Kenya-Ultra 👑`
        });

    }

};
