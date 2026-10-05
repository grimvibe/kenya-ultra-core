export default function style5(data) {

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
╔════════════════════════════╗
║      ⚡ KENYA-ULTRA ⚡
║    DIGITAL CONTROL PANEL
╚════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 ${user}
┃ 👑 ${owner}
┃ 🚀 Version : ${version}
┃ 📡 Ping    : ${ping} ms
┃ 💾 Memory  : ${ram}
┃ ⏱ Uptime  : ${uptime}
┃ 📅 ${date}
┃ 🕒 ${time}
┗━━━━━━━━━━━━━━━━━━━━━━┛

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `╭─────────────〔 ${category.toUpperCase()} 〕\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `│ ✦ ${prefix}${cmd.name}\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 5) {
                        menu += `│    ↳ ${cmd.aliases.slice(i, i + 5).join(", ")}\n`;
                    }

                }

            });

        menu += `╰──────────────────────────\n\n`;

    }

    menu += `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📦 Commands   : ${commands.length}
┃ 📂 Categories : ${Object.keys(grouped).length}
┃ 🔹 Prefix     : ${prefix}
┃ 🌐 WhatsApp Platform
┗━━━━━━━━━━━━━━━━━━━━━━┛

╔════════════════════════════╗
║ ⚡ FAST • 🛡 SAFE • 🤖 SMART
╚════════════════════════════╝

      © 2026 Kenya-Ultra
    Lucid Tech Solutions
`;

    return menu;

}
