import Davex from "../utils/davex.js";
import Reply from "../utils/reply.js";
import SearchCache from "../utils/searchCache.js";

export default {

    name: "moviedl",

    aliases: ["mdl"],

    description: "Get the download link for a resolution shown by .moviepick.",

    category: "Movies",

    usage: ".moviedl <resolution>",

    async execute(message) {

        const pick = SearchCache.get(`${message.sender}:pick`);

        if (!pick) {

            return Reply.error(
`No title selected yet. Run .moviepick <number> first, then:

.moviedl <resolution>

Example: .moviedl 720`
            );

        }

        const resolution = parseInt(message.args?.[0], 10);

        if (!resolution) {

            return Reply.error(
                `Please provide a resolution. Available: ${pick.resolutions.join("P, ")}P`
            );

        }

        if (!pick.resolutions.includes(resolution)) {

            return Reply.error(
                `"${resolution}P" isn't available for this title. Choose from: ${pick.resolutions.join("P, ")}P`
            );

        }

        try {

            const stream = await Davex.movieStream(pick.subjectId, resolution);

            return Reply.download({

                mediaType: "video",
                url: stream.url,
                title: `${pick.title} (${resolution}P)`,
                thumbnail: undefined,
                duration: stream.all_files?.[0]?.duration
                    ? `${Math.round(stream.all_files[0].duration / 60)} min`
                    : "Unknown",
                size: stream.all_files?.[0]?.file_size
                    ? `${(stream.all_files[0].file_size / (1024 * 1024)).toFixed(0)} MB`
                    : "Unknown",
                source: "Kenya-Ultra Movies",
                fileName: `${pick.title}.mp4`,
                mimetype: "video/mp4"

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch the download link for that resolution."
            );

        }

    }

};
