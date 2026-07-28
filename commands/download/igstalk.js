import Downloader from "../../utils/downloader.js";
import Reply from "../../utils/reply.js";

export default {

    name: "igstalk",

    aliases: ["igprofile"],

    description: "Look up an Instagram profile.",

    category: "Download",

    usage: ".igstalk <username>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide an Instagram username.

Example:
.igstalk nasaartemis`
            );

        }

        const username = message.args[0].replace(/^@/, "");

        try {

            const data = await Downloader.ummy(username);

            const user = data.result?.[0]?.user;

            if (!user) {
                throw new Error("Profile not found.");
            }

            return Reply.image({

                url:
                    user.hd_profile_pic_url_info?.url ||
                    user.profile_pic_url,

                caption:
`👤 *${user.full_name || user.username}*
@${user.username} ${user.is_verified ? "✅" : ""}

${user.biography || ""}

👥 Followers: ${user.follower_count?.toLocaleString() || "0"}
➡️ Following: ${user.following_count?.toLocaleString() || "0"}
📸 Posts: ${user.media_count?.toLocaleString() || "0"}
${user.external_url ? `🔗 ${user.external_url}` : ""}

━━━━━━━━━━━━━━

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch Instagram profile."
            );

        }

    }

};
