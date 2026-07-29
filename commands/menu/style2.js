export default function style2(data) {

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
╔══════════════════════════════╗
║      ⚡ KENYA-ULTRA ⚡
║   Premium WhatsApp Assistant
╚══════════════════════════════╝

┏━━━━━━━━━━━━━━
┃ 👤 ${user}
┃ 👑 ${owner}
┃ 🚀 v${version}
┃ 🟢 ONLINE
┗━━━━━━━━━━━━━━

╭───────────────
│ ⚡ Ping    : ${ping} ms
│ 💾 Memory  : ${ram}
│ ⏳ Uptime  : ${uptime}
│ 📅 ${date}
│ 🕒 ${time}
╰───────────────

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `╔═══『 ${category.toUpperCase()} 』\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `║ ❯ ${prefix}${cmd.name}\n`;

            });

        menu += `╚════════════════════\n\n`;

    }

    menu += `
╭───────────────
│ 📦 Commands   : ${commands.length}
│ 📂 Categories : ${Object.keys(grouped).length}
│ 🔹 Prefix     : ${prefix}
│ 🌍 WhatsApp Bot
╰───────────────

▰▰▰▰▰▰▰▰▰▰▰
⚡ KENYA-ULTRA CORE
🛡 Secure • 🚀 Fast • 🤖 Smart
▰▰▰▰▰▰▰▰▰▰▰

© Lucid Tech Solutions
`;

    return menu;

}
