import axios from "axios";
import Reply from "../../utils/reply.js";
import getMention from "../../utils/getMention.js";
import { buildUrl } from "../../utils/nexoracle.js";

// Words backed by the NexOracle reactions-pack API. These endpoints
// return the image directly (binary) — no JSON wrapper — so the
// built URL itself is passed straight through as the image source.
const NEXO_REACTIONS = [
    "bite", "bully", "bonk", "blush", "cringe", "cry", "cuddle",
    "dance", "glomp", "hug", "happy", "kick", "kiss", "wave", "smile"
];

// Remaining words still backed by waifu.pics (no NexOracle
// equivalent was provided for these) — JSON response, data.url.
const WAIFU_REACTIONS = [
    "awoo", "handhold", "highfive", "kill", "nom", "pat", "poke",
    "slap", "smug", "wink", "yeet", "shinobu", "megumin"
];

const REACTIONS = [...NEXO_REACTIONS, ...WAIFU_REACTIONS];

// Words where the message reads better without "you" (character
// images, not really an action toward someone).
const NO_TARGET = new Set(["shinobu", "megumin"]);

const VERB_TEXT = {
    awoo: "howls",
    bite: "bites",
    bully: "bullies",
    blush: "blushes at",
    bonk: "bonks",
    cringe: "cringes at",
    cry: "cries because of",
    cuddle: "cuddles",
    dance: "dances with",
    glomp: "glomps",
    handhold: "holds hands with",
    happy: "is happy because of",
    highfive: "high-fives",
    hug: "hugs",
    kick: "kicks",
    kiss: "kisses",
    kill: "(fictionally) kills",
    nom: "noms on",
    pat: "pats",
    poke: "pokes",
    slap: "slaps",
    smile: "smiles at",
    smug: "is smug at",
    wave: "waves at",
    wink: "winks at",
    yeet: "yeets",
    shinobu: "summons Shinobu",
    megumin: "summons Megumin ('EXPLOSION!')"
};

async function fetchImageUrl(type) {

    if (NEXO_REACTIONS.includes(type)) {
        return buildUrl(`/reactions-pack/${type}`);
    }

    const { data } = await axios.get(
        `https://api.waifu.pics/sfw/${type}`,
        { timeout: 10000 }
    );

    return data.url || null;

}

export default {

    name: "hug",

    aliases: REACTIONS.filter(r => r !== "hug"),

    description: "Anime reaction images — hug, pat, slap, kiss, cry, dance, and more. Mention someone to direct it at them.",

    category: "Anime",

    usage: ".hug @user  |  .pat  |  .slap @user  |  etc.",

    async execute(message) {

        const type = REACTIONS.includes(message.commandName)
            ? message.commandName
            : "hug";

        try {

            const url = await fetchImageUrl(type);

            if (!url) {
                return Reply.error("Couldn't fetch an image right now, try again.");
            }

            const target = getMention(message.message);
            const verb = VERB_TEXT[type] || type;

            let caption;
            let mentions = [];

            if (NO_TARGET.has(type)) {

                caption = `✨ ${verb}!`;

            } else if (target) {

                caption = `${message.pushName || "Someone"} ${verb} @${target.split("@")[0]}!`;
                mentions = [target];

            } else {

                caption = `${message.pushName || "Someone"} ${verb} the air! (mention someone next time 👀)`;

            }

            return Reply.image({
                url,
                caption,
                mentions
            });

        } catch (err) {

            return Reply.error(
                err.message || "Failed to fetch that reaction image."
            );

        }

    }

};
