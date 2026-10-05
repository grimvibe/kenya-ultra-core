export default function style4(data) {

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
╭─────────────◇
│ ✦ ʙᴏᴛ : Kᴇɴʏᴀ-Uʟᴛʀᴀ
│ ✦ ᴜsᴇʀ : ${user}
│ ✦ ᴏᴡɴᴇʀ : ${owner}
│ ✦ ᴠᴇʀsɪᴏɴ : ${version}
│ ✦ sᴛᴀᴛᴜs : Online
│ ✦ ᴘɪɴɢ : ${ping} ms
│ ✦ ʀᴀᴍ : ${ram}
│ ✦ ᴜᴘᴛɪᴍᴇ : ${uptime}
│ ✦ ᴅᴀᴛᴇ : ${date}
│ ✦ ᴛɪᴍᴇ : ${time}
╰─────────────◇

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `╭──『 ${category.toUpperCase()} 』\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `│ ▢ ${prefix}${cmd.name}\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 5) {
                        menu += `│    ↳ ${cmd.aliases.slice(i, i + 5).join(", ")}\n`;
                    }

                }

            });

        menu += `╰─────────────◇\n\n`;

    }

    menu += `
╭──『 SYSTEM 』
│ ▢ Commands : ${commands.length}
│ ▢ Categories : ${Object.keys(grouped).length}
│ ▢ Prefix : ${prefix}
│ ▢ Engine : Kenya-Ultra
╰─────────────◇

> ⚡ Powered by Kenya-Ultra
> © 2026 Lucid Tech Solutions
`;

    return menu;

}
