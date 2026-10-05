const SMALL_CAPS = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ",
    h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
    o: "ᴏ", p: "ᴘ", q: "Q", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ",
    v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
};

function smallCaps(str) {
    return String(str)
        .toLowerCase()
        .split("")
        .map(ch => SMALL_CAPS[ch] || ch)
        .join("");
}

const CATEGORY_EMOJI = {
    general: "⚙️", ai: "🤖", admin: "👮", group: "👮",
    moderation: "🛡️", media: "📥", download: "📥",
    sports: "⚽", fun: "🎮", owner: "👑", utility: "🔧", other: "📂"
};

function categoryEmoji(category) {
    return CATEGORY_EMOJI[category.toLowerCase()] || "📂";
}

export default function style9(data) {

    const { grouped, commands, owner, version, ram, uptime, date, time, user, prefix } = data;

    let menu = `✪━━━〔 *${smallCaps("bot info")}* 〕━━━✪\n`;
    menu += `┃ 🤖 *${smallCaps("bot")}*      : Kenya-Ultra\n`;
    menu += `┃ 👤 *${smallCaps("user")}*     : ${user}\n`;
    menu += `┃ ⚙️  *${smallCaps("prefix")}*   : [ ${prefix} ]\n`;
    menu += `┃ 🕒 *${smallCaps("runtime")}*  : ${uptime}\n`;
    menu += `┃ 🚀 *${smallCaps("version")}*  : v${version}\n`;
    menu += `┃ 💻 *${smallCaps("platform")}* : WhatsApp\n`;
    menu += `┃ 🔢 *${smallCaps("node.js")}*  : ${process.version}\n`;
    menu += `┃ 📦 *${smallCaps("memory")}*   : ${ram}\n`;
    menu += `┃ 📊 *${smallCaps("commands")}* : ${commands.length}\n`;
    menu += `┃ 👑 *${smallCaps("owner")}*    : ${owner}\n`;
    menu += `┃ 📅 ${date}  🕒 ${time}\n`;
    menu += `✪━━━━━━━━━━━━━━━━━━━━✪\n\n`;

    for (const category of Object.keys(grouped).sort()) {

        const emoji = categoryEmoji(category);
        const title = smallCaps(category);

        menu += `╭━━━〔 *${emoji} ${title}* 〕━━━╮\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `┃ ✬ ${smallCaps(cmd.name)}\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 5) {
                        menu += `┃    ↳ ${cmd.aliases.slice(i, i + 5).map(smallCaps).join(", ")}\n`;
                    }

                }

            });

        menu += "╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n";

    }

    menu += `✪━━━━━━━━━━━━━━━━━━━━✪\n`;
    menu += `┃ ⚡ ${smallCaps("fast")} • ${smallCaps("smooth")} • ${smallCaps("premium")}\n`;
    menu += `┃ 🚀 ${smallCaps("powered by")} Kenya-Ultra\n`;
    menu += `✪━━━━━━━━━━━━━━━━━━━━✪`;

    return menu;
}
