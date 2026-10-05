import axios from "axios";
import NexOracle from "../../utils/nexoracle.js";
import Reply from "../../utils/reply.js";

export default {

    name: "igstory",

    aliases: ["igstories"],

    description: "Download a user's current Instagram stories.",

    category: "Download",

    usage: ".igstory <username>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide an Instagram username.

Example:
.igstory nasaartemis`
            );

        }

        const username = message.args[0].replace(/^@/, "");

        try {

            if (message.sock) {

                await message.sock.sendMessage(
                    message.chat,
                    {
                        react: {
                            text: "⏳",
                            key: message.rawMessage.key
                        }
                    }
                );

            }

            const url = NexOracle.buildUrl(
                "/downloader/insta-story",
                { username }
            );

            const { data } = await axios.get(url);

            // NOTE: verify against a live response — API shape wasn't
            // confirmed at write time. Adjust field names below once
            // you see real output.
            const stories =
                data?.result?.stories ||
                data?.result ||
                data?.stories ||
                [];

            const items = Array.isArray(stories) ? stories : [stories];

            if (!items.length) {
                throw new Error(
                    `No active stories found for @${username}.`
                );
            }

            if (message.sock) {

                await message.sock.sendMessage(
                    message.chat,
                    {
                        react: {
                            text: "✅",
                            key: message.rawMessage.key
                        }
                    }
                );

            }

            // Send all but the last as plain sends, return the last
            // via Reply so the command has a proper response.
            for (const item of items.slice(0, -1)) {

                const mediaUrl = item?.url || item?.video || item?.image;
                if (!mediaUrl) continue;

                const isVideo =
                    /\.mp4($|\?)/i.test(mediaUrl) ||
                    item?.type === "video";

                if (message.sock) {

                    await message.sock.sendMessage(
                        message.chat,
                        isVideo
                            ? { video: { url: mediaUrl }, caption: `📖 @${username}` }
                            : { image: { url: mediaUrl }, caption: `📖 @${username}` }
                    );

                }

            }

            const last = items[items.length - 1];
            const lastUrl = last?.url || last?.video || last?.image;

            if (!lastUrl) {
                throw new Error("Story media URL missing from response.");
            }

            const lastIsVideo =
                /\.mp4($|\?)/i.test(lastUrl) ||
                last?.type === "video";

            if (lastIsVideo) {

                return Reply.video({

                    url: lastUrl,

                    fileName: "igstory.mp4",

                    caption:
`📖 *Instagram Story — @${username}*

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

                });

            }

            return Reply.image({

                url: lastUrl,

                caption:
`📖 *Instagram Story — @${username}*

✅ Download Complete

🐺 Powered by Kenya-Ultra 👑`

            });

        } catch (err) {

            console.error("igstory error:", err.message);

            if (message.sock) {

                await message.sock.sendMessage(
                    message.chat,
                    {
                        react: {
                            text: "❌",
                            key: message.rawMessage.key
                        }
                    }
                );

            }

            return Reply.error(
                err.message ||
                `Failed to fetch stories for @${username}.`
            );

        }

    }

};
