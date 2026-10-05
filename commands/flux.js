import axios from "axios";
import Reply from "../utils/reply.js";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const POLL_INTERVAL_MS = 7000;
const MAX_ATTEMPTS = 35;

async function generateFluxImage(prompt) {

    const { data: init } = await axios.get(
        "https://omegatech-api.dixonomega.tech/api/ai/flux-pro2",
        {
            params: { prompt },
            timeout: 20000
        }
    );

    if (!init.success || !init.task_id) {
        throw new Error("Failed to start Flux generation task.");
    }

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {

        await sleep(POLL_INTERVAL_MS);

        const { data: check } = await axios.get(
            "https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result",
            {
                params: { task_id: init.task_id },
                timeout: 20000
            }
        );

        if (check.status === "completed" && check.image_url) {
            return check.image_url;
        }

        if (check.status === "failed") {
            throw new Error("Generation failed on the API's end.");
        }

    }

    throw new Error(
        `Generation timed out after ${MAX_ATTEMPTS} attempts.`
    );

}

export default {

    name: "flux",

    aliases: ["fluxpro", "flux2"],

    description: "Generate an image from a text prompt using Flux Pro 2.",

    category: "AI",

    usage: ".flux <prompt>",

    async execute(message) {

        if (!message.args || !message.args.length) {

            return Reply.error(
`Please provide a prompt.

Example:
.flux beautiful cyberpunk girl`
            );

        }

        const prompt = message.args.join(" ");

        try {

            const imageUrl = await generateFluxImage(prompt);

            return Reply.image({

                url: imageUrl,

                caption:
`╭━━━〔 ✦ FLUX PRO 2 ✦ 〕━━━⬣
┃ 📝 Prompt: ${prompt}
┃ ⚡ Model: Flux Pro 2
┃ 🐺 Bot: Kenya-Ultra
╰━━━━━━━━━━━━━━━━━━⬣`

            });

        } catch (err) {

            console.log(`⚠ flux command failed: ${err.message}`);

            return Reply.error(
                `Flux Error: ${err.message || err}`
            );

        }

    }

};
