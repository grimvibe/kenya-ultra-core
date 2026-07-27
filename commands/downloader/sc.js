import Downloader from "../../lib/Downloader.js";

export default {
    name: "sc",
    aliases: ["soundcloud"],
    category: "Downloader",
    description: "Search and download SoundCloud audio.",

    async execute(sock, m, args) {

        if (!args.length)
            return m.reply("Example:\n.sc Heat Waves");

        try {

            const query = args.join(" ");

            // Search SoundCloud
            const results = await Downloader.scSearch(query);

            const first = results[0];

            // Download first result
            const data = await Downloader.soundcloud(first.permalink_url);

            const duration = Math.floor(data.duration / 1000);
            const minutes = Math.floor(duration / 60);
            const seconds = String(duration % 60).padStart(2, "0");

            const caption =
`☁️ *SoundCloud Downloader*

🎵 *${data.title}*
👤 ${data.user}
⏱ ${minutes}:${seconds}

⬇️ Downloading audio...`;

            // Thumbnail
            await sock.sendMessage(
                m.chat,
                {
                    image: { url: data.thumbnail },
                    caption
                },
                { quoted: m }
            );

            // Audio
            await sock.sendMessage(
                m.chat,
                {
                    audio: { url: data.url },
                    mimetype: "audio/mpeg",
                    fileName: `${data.title}.mp3`
                },
                { quoted: m }
            );

        } catch (err) {

            m.reply(`❌ ${err.message}`);

        }

    }
};
