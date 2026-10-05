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

export default function style10(data) {

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

    let menu = `> *┏━━━━━━━━━━━━━━━━━━┓*
> *┃   ${mono("KENYA-ULTRA")}
> *┗━━━━━━━━━━━━━━━━━━┛*

> *╭━━━━⊷ ${mono("INFO BOT")} ⊷━━━━*
> *║德╭───────────────*
> *║德┃ ${mono("USER")}  : *${user}*
> *║德┃ ${mono("STATUS")} : Online*
> *║德┃ ${mono("PREFIX")} : "${prefix}"*
> *║德┃ ${mono("VERSION")} : v${version}*
> *║德┃ ${mono("RUNTIME")} : ${uptime}*
> *║德┃ ${mono("MEMORY")} : ${ram}*
> *║德┃ ${mono("COMMANDS")} : ${commands.length}*
> *║德┃ ${mono("OWNER")} : ${owner}*
> *║德╰───────────────*
> *╰━━━━━━━━━━━━━━━━━━*
`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `\n         *${mono(category.toUpperCase())}*\n`;
        menu += `> *╭━━━━━━━━━━━━━━━━━━*\n`;
        menu += `> *┃德╭───────────────*\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `> *┃德┃${mono(cmd.name.toUpperCase())}*\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 4) {
                        menu += `> *┃德┃  ↳ ${mono(cmd.aliases.slice(i, i + 4).join(", ").toUpperCase())}*\n`;
                    }

                }

            });

        menu += `> *┃德╰───────────────*\n`;
        menu += `> *╰━━━━━━━━━━━━━━━━━━*\n`;

    }

    menu += `
*${mono("JOIN MY OFFC CHANNEL")}*

> *© ${mono("POWERED BY KENYA-ULTRA")}*`;

    return menu;

}
