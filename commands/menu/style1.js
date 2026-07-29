export default function style1(data) {

    const {
        grouped,
        commands,
        owner,
        version,
        ram,
        uptimeText,
        date,
        time,
        user
    } = data;

    let menu = `╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃ ⚡ *KENYA-ULTRA*
┃ Next Generation WhatsApp Bot
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 SYSTEM STATUS 〕
│ 👤 User : ${user}
│ 👑 Owner : ${owner}
│ 🚀 Version : v${version}
│ 🟢 Status : ONLINE
│ 💾 RAM : ${ram}
│ ⏱ Uptime : ${uptimeText}
│ 📅 ${date}
│ 🕒 ${time}
╰───────────────────

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `╭─〔 ${category.toUpperCase()} 〕\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `│ ◈ ${cmd.name}\n`;

            });

        menu += "╰───────────────────\n\n";

    }

    menu += `╭─〔 BOT INFO 〕
│ 📦 Commands : ${commands.length}
│ 📂 Categories : ${Object.keys(grouped).length}
│ 🔹 Prefix : .
│ 🌍 Platform : WhatsApp
╰───────────────────

> © 2026 Kenya-Ultra
> Powered by Lucid Tech Solutions`;

    return menu;

}
