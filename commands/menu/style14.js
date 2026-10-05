const MONO = {
    "0": "𝟶", "1": "𝟷", "2": "𝟸", "3": "𝟹", "4": "𝟺",
    "5": "𝟻", "6": "𝟼", "7": "𝟽", "8": "𝟾", "9": "𝟿",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶",
    H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼", N: "𝙽",
    O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄",
    V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉",
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐",
    h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖", n: "𝚗",
    o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞",
    v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣"
};

function mono(str) {
    return String(str)
        .split("")
        .map(ch => MONO[ch] || ch)
        .join("");
}

const CATEGORY_ICON = {
    ai: "🧠",
    media: "🎧",
    download: "🎧",
    search: "🔍",
    utility: "🔧",
    fun: "🎭",
    anime: "🎭",
    group: "🛡️",
    owner: "🛡️",
    general: "⚙️"
};

function iconFor(category) {
    const key = category.toLowerCase();
    for (const word in CATEGORY_ICON) {
        if (key.includes(word)) return CATEGORY_ICON[word];
    }
    return "✦";
}

export default function style14(data) {

    const {
        grouped,
        commands,
        owner,
        version,
        ram,
        uptime,
        date,
        time,
        user,
        prefix
    } = data;

    let menu = `> *╭◇═══════════════════◇╮*
> *┃                       ┃*
> *┃   ⚡ ${mono("KENYA-ULTRA")} ⚡*
> *┃  ${mono("THE ULTIMATE BOT")}  *
> *┃                       ┃*
> *╰◇═══════════════════◇╯*

> *◇────[ ${mono("BOT INFORMATION")} ]────◇*
> *彡 USER     : *${user}*
> *彡 STATUS   : 🟢 Online*
> *彡 PREFIX   : "${prefix}"*
> *彡 VERSION  : v${version}*
> *彡 RUNTIME  : ${uptime}*
> *彡 MEMORY   : ${ram}*
> *彡 COMMANDS : ${commands.length}*
> *彡 OWNER    : ${owner}*
> *╰─────────────────────╯*

> *◇────[ ${mono("MAIN MENU")} ]────◇*
`;

    const categories = Object.keys(grouped).sort();

    categories.forEach((category, index) => {

        const num = String(index + 1).padStart(2, "0");
        const icon = iconFor(category);

        menu += `\n*${num}* ${icon} *${category.toUpperCase()}*\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                const words = cmd.aliases?.length
                    ? [cmd.name.toUpperCase(), ...cmd.aliases.map(a => a.toUpperCase())]
                    : [cmd.name.toUpperCase()];

                for (let i = 0; i < words.length; i += 5) {
                    const prefixMark = i === 0 ? "彡" : "  ";
                    menu += `${prefixMark} ${words.slice(i, i + 5).join(", ")}\n`;
                }

            });

        if (index < categories.length - 1) {
            menu += `───────────────────────\n`;
        }

    });

    menu += `
> *╭─────────────────────╮*
> *┃ Powered by Kenya-Ultra ┃*
> *┃  ${mono("KENYA-ULTRA")} • 2026 ┃*
> *╰─────────────────────╯*`;

    return menu;

}
