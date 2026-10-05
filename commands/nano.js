import axios from "axios";
import Reply from "../utils/reply.js";
import { getQuotedMessage } from "../utils/getMention.js";

export default {

    name: "nano",

    description: "Generate an image from a prompt, or reply to an image with an instruction to edit it.",

    category: "AI",

    usage: ".nano <prompt> or reply to an image with .nano <instruction>",

    async execute(ctx) {

        const quoted = getQuotedMessage(ctx.message);
        const prompt = (ctx.args || []).join(" ").trim();

        // ==========================
        // IMAGE EDIT MODE
        // ==========================
        // Actual download/upload/edit happens gateway-side (it needs
        // the live socket to pull the quoted image) — this just
        // signals the gateway to do it and supplies the caption.

        if (quoted?.imageMessage) {

            if (!prompt) {

                return Reply.error(
`Reply with an instruction.

Example:
.nano make it look like a zombie`
                );

            }

            return {

                success: true,

                action: "nano_edit",

                prompt,

                reply: {

                    text:
`╭━━━〔 🍌 *NANO EDIT* 〕━━━⬣
┃ 📝 *Prompt:* ${prompt}
┃ ⚡ *Mode:* Edit
┃ 🐺 *Bot:* Kenya-Ultra
╰━━━━━━━━━━━━━━⬣`

                }

            };

        }

        // ==========================
        // GENERATE MODE
        // ==========================
        // No media involved — safe to call the API directly here.

        if (!prompt) {

            return Reply.error(
`Please provide a prompt.

📝 *Generate:* .nano <prompt>
📸 *Edit:* reply to image with .nano <instruction>
🎨 *Blend:* .nanopro

Example:
.nano a cat wearing sunglasses`
            );

        }

        try {

            const { data } = await axios.get(
                "https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro",
                {
                    params: { prompt },
                    timeout: 30000
                }
            );

            if (!data?.image) {
                throw new Error("No image generated.");
            }

            return Reply.image({

                url: data.image,

                caption:
`╭━━━〔 🍌 *NANO GEN* 〕━━━⬣
┃ 📝 *Prompt:* ${prompt}
┃ ⚡ *Mode:* Generate
┃ 🐺 *Bot:* Kenya-Ultra
╰━━━━━━━━━━━━━━⬣`

            });

        } catch (err) {

            console.log(`⚠ nano command failed: ${err.message}`);

            return Reply.error(
                `Generation failed: ${err.message || err}`
            );

        }

    }

};
