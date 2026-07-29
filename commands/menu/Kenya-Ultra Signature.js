export default function style8(data) {

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
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      ⚡ K E N Y A - U L T R A
┃      ◈ SIGNATURE EDITION ◈
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭─────────────〔 PROFILE 〕
│ 👤 User      : ${user}
│ 👑 Developer : ${owner}
│ 🚀 Version   : ${version}
│ 🟢 Status    : ONLINE
╰──────────────────────────

╭─────────────〔 SYSTEM 〕
│ ⚡ Ping      : ${ping} ms
│ 💾 RAM       : ${ram}
│ ⏳ Uptime    : ${uptime}
│ 📅 ${date}
│ 🕒 ${time}
╰──────────────────────────

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `╭━━━〔 ${category.toUpperCase()} 〕━━━╮\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `┃ ◆ ${prefix}${cmd.name}\n`;

            });

        menu += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    }

    menu += `
╭─────────────〔 BOT INFO 〕
│ 📦 Commands   : ${commands.length}
│ 📂 Categories : ${Object.keys(grouped).length}
│ 🔹 Prefix     : ${prefix}
│ 🌐 Platform   : WhatsApp
╰──────────────────────────

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   ⚡ FAST
┃   🛡 SECURE
┃   🤖 INTELLIGENT
┃   🚀 NEXT GENERATION BOT
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

      © 2026 Kenya-Ultra
     Lucid Tech Solutions
`;

    return menu;

}
