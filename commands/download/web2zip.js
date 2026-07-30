import Prexzy from "../../utils/prexzy.js";
import Reply from "../../utils/reply.js";

export default {

    name: "web2zip",

    aliases: ["sitezip"],

    description: "Save an entire website as a ZIP archive.",

    category: "Download",

    usage: ".web2zip <website url>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a website URL.

Example:
.web2zip https://example.com`
            );

        }

        const url = message.args[0];

        try {

            const result = await Prexzy.web2zip(url);

            return Reply.document({

                url: result.downloadUrl,

                fileName: "website.zip",

                mimetype: "application/zip"

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to archive that website."
            );

        }

    }

};
