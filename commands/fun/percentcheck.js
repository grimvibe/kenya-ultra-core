import Reply from "../../utils/reply.js";
import getMention, { getQuotedParticipant } from "../../utils/getMention.js";

// Each "check" is deterministic per target — the same person gets
// the same result every time for a given check type (a hash of their
// id + the check type), rather than a fresh random number each run.
// That's the expected behavior for these — not a coin flip.

const CHECKS = {

    cool: {
        label: "😎 Cool Meter",
        tiers: [
            [0, 20, "not cool at all... yikes 💀"],
            [20, 40, "mid, could be cooler"],
            [40, 60, "decently cool 😌"],
            [60, 80, "certified cool 😎"],
            [80, 101, "ICE COLD 🧊🔥"]
        ]
    },

    dog: {
        label: "🐶 Dog Meter",
        tiers: [
            [0, 20, "0% dog, 100% cat person"],
            [20, 40, "a little bit doggo"],
            [40, 60, "good boy/girl energy"],
            [60, 80, "certified good boy 🐕"],
            [80, 101, "MAXIMUM DOGGO 🐕🦴"]
        ]
    },

    evil: {
        label: "😈 Evil Meter",
        tiers: [
            [0, 20, "wholesome, no evil detected"],
            [20, 40, "slightly mischievous"],
            [40, 60, "morally grey"],
            [60, 80, "certified menace 😈"],
            [80, 101, "FINAL BOSS ENERGY 🔥😈"]
        ]
    },

    gigachad: {
        label: "🗿 Gigachad Meter",
        tiers: [
            [0, 20, "not gigachad... yet"],
            [20, 40, "beta energy detected"],
            [40, 60, "on the path"],
            [60, 80, "approaching gigachad"],
            [80, 101, "GIGACHAD CONFIRMED 🗿💪"]
        ]
    },

    great: {
        label: "🌟 Greatness Meter",
        tiers: [
            [0, 20, "room to grow"],
            [20, 40, "showing potential"],
            [40, 60, "pretty great honestly"],
            [60, 80, "certified great"],
            [80, 101, "LEGENDARY STATUS 🌟👑"]
        ]
    },

    hot: {
        label: "🔥 Hotness Meter",
        tiers: [
            [0, 20, "cold as ice ❄️"],
            [20, 40, "lukewarm"],
            [40, 60, "warming up 🌡️"],
            [60, 80, "certified hot 🔥"],
            [80, 101, "ON FIRE 🔥🔥🔥"]
        ]
    },

    simp: {
        label: "🥺 Simp Meter",
        tiers: [
            [0, 20, "not a simp, stone cold"],
            [20, 40, "slightly simping"],
            [40, 60, "mid-tier simp"],
            [60, 80, "certified simp 🥺"],
            [80, 101, "MAXIMUM SIMP 🥺💸"]
        ]
    },

    smart: {
        label: "🧠 Smart Meter",
        tiers: [
            [0, 20, "still learning the basics"],
            [20, 40, "average intelligence"],
            [40, 60, "pretty sharp 🧠"],
            [60, 80, "genuinely smart"],
            [80, 101, "cracked the simulation 🧠✨"]
        ]
    },

    stupid: {
        label: "🤡 Stupidity Meter",
        tiers: [
            [0, 20, "surprisingly sharp"],
            [20, 40, "occasional brain fog"],
            [40, 60, "average clown levels"],
            [60, 80, "certified clown 🤡"],
            [80, 101, "GALAXY BRAIN... in reverse"]
        ]
    },

    unclean: {
        label: "🧹 Messiness Meter",
        tiers: [
            [0, 20, "spotless, room like a museum"],
            [20, 40, "mostly tidy"],
            [40, 60, "average chaos levels"],
            [60, 80, "certified messy 🧹"],
            [80, 101, "BIOHAZARD ZONE 🧹💀"]
        ]
    },

    waifu: {
        label: "💖 Waifu Material Meter",
        tiers: [
            [0, 20, "not quite waifu material yet"],
            [20, 40, "showing potential"],
            [40, 60, "decent waifu energy"],
            [60, 80, "certified waifu material 💖"],
            [80, 101, "PEAK WAIFU 💖👑"]
        ]
    }

};

// Simple, stable string hash -> 0-100.
function hashPercent(str) {

    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }

    return hash % 101;

}

function bar(percent) {

    const filled = Math.round(percent / 10);
    return "▓".repeat(filled) + "░".repeat(10 - filled);

}

export default {

    name: "check",

    aliases: Object.keys(CHECKS).map(k => `${k}check`),

    description: "Fun percentage checks — hotcheck, simpcheck, gigachadcheck, and more.",

    category: "Fun",

    usage: ".hotcheck @user  |  .check <type> @user",

    async execute(message) {

        let type = message.commandName?.replace(/check$/, "");

        if (message.commandName === "check") {
            type = (message.args?.[0] || "").toLowerCase();
        }

        if (!CHECKS[type]) {

            const available = Object.keys(CHECKS)
                .map(k => `${k}check`)
                .join(", ");

            return Reply.error(
`Please pick a valid check type.

Available: ${available}`
            );

        }

        const target =
            getQuotedParticipant(message.message) ||
            getMention(message.message) ||
            message.sender;

        const isSelf = target === message.sender;
        const name = isSelf
            ? (message.pushName || "You")
            : `@${target.split("@")[0]}`;

        const percent = hashPercent(`${target}:${type}`);
        const config = CHECKS[type];

        const tier = config.tiers.find(
            ([min, max]) => percent >= min && percent < max
        );

        return Reply.text(
`${config.label}

${name}
${bar(percent)} ${percent}%

${tier[2]}`,
            target !== message.sender ? [target] : []
        );

    }

};
