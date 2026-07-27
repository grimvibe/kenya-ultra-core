import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "ytmp4",

    description: "Download YouTube video.",

    category: "Download",

    usage: ".ytmp4 <youtube-link>",

    async execute(message) {

        if (!message.args?.length) {

            return Reply.error(
`Please provide a YouTube link.

Example:
.ytmp4 https://youtu.be/dQw4w9WgXcQ`
            );

        }

        const url = message.args[0];

        try {

            const result = await Downloader.ytmp4(url);

            return Reply.download({

                mediaType: "video",

                url: result.downloadUrl,

                title: result.title,

                thumbnail:
                    result.thumbnail ||

                    "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",

                duration:
                    result.duration || "Unknown",

                size:
                    result.size || "Unknown",

                source: "YouTube",

                fileName:
                    `${result.title}.mp4`,

                mimetype:
                    "video/mp4"

            });

        }

        catch (err) {

            console.error(err);

            return Reply.error(

                err.message ||

                "Failed to download video."

            );

        }

    }

};
