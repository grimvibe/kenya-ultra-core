export default function style7(data) {

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
╔═════『 🎮 KENYA-ULTRA 🎮 』═════╗
║        RGB GAMING EDITION
╚════════════════════════════════╝

◈ PLAYER     : ${user}
◈ OWNER      : ${owner}
◈ VERSION    : ${version}
◈ STATUS     : 🟢 ONLINE
◈ LATENCY    : ${ping} ms
◈ MEMORY     : ${ram}
◈ UPTIME     : ${uptime}

◈ DATE       : ${date}
◈ TIME       : ${time}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `╭━━━〔 🎯 ${category.toUpperCase()} 〕\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `┃ ➤ ${prefix}${cmd.name}\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 5) {
                        menu += `┃    ↳ ${cmd.aliases.slice(i, i + 5).join(", ")}\n`;
                    }

                }

            });

        menu += `╰━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    }

    menu += `
╔═══════〔 SYSTEM INFO 〕═══════╗
║ 📦 Commands   : ${commands.length}
║ 📂 Categories : ${Object.keys(grouped).length}
║ 🔹 Prefix     : ${prefix}
║ 🤖 Engine     : Kenya-Ultra
╚══════════════════════════════╝

▰▰▰▰▰▰▰▰▰▰▰▰
⚡ HIGH PERFORMANCE MODE
🛡 SECURITY LEVEL : MAX
🚀 AI CORE : ACTIVE
▰▰▰▰▰▰▰▰▰▰▰▰

© 2026 Kenya-Ultra
Lucid Tech Solutions
`;

    return menu;

}
