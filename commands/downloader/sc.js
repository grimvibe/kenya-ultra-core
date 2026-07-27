import Downloader from "../../lib/Downloader.js";

export default {
    name: "sc",
    aliases: ["soundcloud"],

    async execute(sock, m, args) {

        if (!args.length)
            return m.reply("Example:\n.sc Heat Waves");

        try {

            const query = args.join(" ");

            const results = await Downloader.scSearch(query);

            const first = results[0];

            const data = await Downloader.soundcloud(first.permalink_url);

            const caption =
`☁️ *SoundCloud Downloader*

🎵 ${data.title}
👤 ${data.user}

⏳ ${Math.floor(data.duration / 1000)} sec

⬇ Downloading...`;

            await sock.sendMessage(
                m.chat,
                {
                    image: { url: data.thumbnail },
                    caption
                },
                { quoted: m }
            );

            await sock.sendMessage(
                m.chat,
                {
                    audio: { url: data.url },
                    mimetype: "audio/mpeg",
                    fileName: `${data.title}.mp3`
                },
                { quoted: m }
            );

        } catch (e) {
            m.reply(`❌ ${e.message}`);
        }

    }
};
