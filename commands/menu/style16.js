const SANS_BOLD = {
    "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰",
    "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚",
    H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡",
    O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨",
    V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴",
    h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻",
    o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂",
    v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇"
};

function sansBold(str) {
    return String(str)
        .split("")
        .map(ch => SANS_BOLD[ch] || ch)
        .join("");
}

const CATEGORY_ICON = {
    ai: "🧠",
    media: "☁️",
    download: "☁️",
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

export default function style16(data) {

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

    let menu = `> *▬▬▭▭▭ ⋆ 👑 ⋆ ▭▭▭▬▬*
> *${sansBold("KENYA-ULTRA")}*
> *${sansBold("THE ULTIMATE WHATSAPP BOT")}*
> *▬▬▭▭▭▭▭▭▭▭▭▭▭▭▭▬▬*

> *─────《 ${sansBold("BOT PROFILE")} 》─────*
> *械 USER     : *${user}*
> *械 STATUS   : 🟢 ONLINE*
> *械 PREFIX   : "${prefix}"*
> *械 VERSION  : v${version}*
> *械 RUNTIME  : ${uptime}*
> *械 MEMORY   : ${ram}*
> *械 COMMANDS : ${commands.length}*
> *械 OWNER    : ${owner}*
> *─────────────────────*

> *─────《 ${sansBold("CATEGORIES")} 》─────*
`;

    const categories = Object.keys(grouped).sort();

    categories.forEach((category, index) => {

        const num = String(index + 1).padStart(2, "0");
        const icon = iconFor(category);

        menu += `\n◉ *${num}* ${icon} *${sansBold(category.toUpperCase())}*\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                const words = cmd.aliases?.length
                    ? [cmd.name.toUpperCase(), ...cmd.aliases.map(a => a.toUpperCase())]
                    : [cmd.name.toUpperCase()];

                for (let i = 0; i < words.length; i += 5) {
                    const mark = i === 0 ? "械" : "  ";
                    menu += `${mark} ${words.slice(i, i + 5).join(", ")}\n`;
                }

            });

        if (index < categories.length - 1) {
            menu += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
        }

    });

    menu += `
> *▬▬▭▭▭▭▭▭▭▭▭▭▭▭▭▬▬*
> *K  POWERED BY LUCID TECH SOLUTIONS*
> *${sansBold("KENYA-ULTRA")} • 2026*`;

    return menu;

}
