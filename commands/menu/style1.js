export default function style1(data) {

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
        prefix,
        ping
    } = data;

    let menu = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
┃      🤖  KENYA-ULTRA
┃   Next Generation WhatsApp AI
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣

╭─〔 SYSTEM 〕
│ 👤 User      : ${user}
│ 👑 Developer : ${owner}
│ ⚙️ Version   : v${version}
│ 📶 Status    : ONLINE
│ ⚡ Speed     : ${ping} ms
│ 💾 RAM       : ${ram}
│ ⏳ Uptime    : ${uptime}
│ 📅 ${date}
│ 🕒 ${time}
╰────────────────────────⬣

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `╭─〔 ${category.toUpperCase()} 〕\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `│ ⬡ ${prefix}${cmd.name}\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 5) {
                        menu += `│    ↳ ${cmd.aliases.slice(i, i + 5).join(", ")}\n`;
                    }

                }

            });

        menu += "╰────────────────────────⬣\n\n";

    }

    menu += `
╭─〔 BOT INFO 〕
│ 📦 Commands   : ${commands.length}
│ 📂 Categories : ${Object.keys(grouped).length}
│ 🔹 Prefix     : ${prefix}
│ 🌐 Platform   : WhatsApp
╰────────────────────────⬣

╭─〔 KENYA-ULTRA 〕
│ ⚡ Fast
│ 🛡 Secure
│ 🚀 Reliable
│ 🤖 AI Powered
╰────────────────────────⬣

> © 2026 Kenya-Ultra
> Developed by Lucid Tech Solutions
`;

    return menu;

}
