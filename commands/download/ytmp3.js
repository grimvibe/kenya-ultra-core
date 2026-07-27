import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "ytmp3",

    description: "Download YouTube audio.",

    category: "Download",

    usage: ".ytmp3 <youtube-link>",

    async execute(message) {

        if (!message.args?.length) {

            return Reply.error(
`Please provide a YouTube link.

Example:
.ytmp3 https://youtu.be/dQw4w9WgXcQ`
            );

        }

        const url = message.args[0];

        try {

            const result = await Downloader.ytmp3(url);

            return Reply.download({

                mediaType: "audio",

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
                    `${result.title}.mp3`,

                mimetype:
                    "audio/mpeg"

            });

        }

        catch (err) {

            console.error(err);

            return Reply.error(

                err.message ||

                "Failed to download audio."

            );

        }

    }

};
