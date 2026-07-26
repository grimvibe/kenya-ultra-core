import Reply from "../../utils/reply.js";
import MaxxTech from "../../utils/maxxtech.js";

export default {

    name: "ytmp3",

    description: "Download YouTube audio.",

    category: "Download",

    async execute(ctx) {

        const { args } = ctx;

        if (!args.length)
            return Reply.error(
                "Usage:\n.ytmp3 <youtube link>"
            );

        const url = args.join(" ");

        const result = await MaxxTech.downloader(url);

        const audio =
            result.formats.sort(
                (a, b) => b.size - a.size
            )[0];

        return Reply.audio({
            url: audio.url,
            mimetype: audio.mime,
            fileName: `${result.title}.${audio.ext}`,
            caption:
`🎵 ${result.title}

👤 ${result.uploader}
⏱ ${result.duration}s
💾 ${audio.size_human}

🐺 Kenya-Ultra`
        });

    }

};
