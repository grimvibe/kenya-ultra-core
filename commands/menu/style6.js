export default function style6(data) {

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
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃        [ KENYA-ULTRA ]
┃     MATRIX TERMINAL v${version}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> USER      : ${user}
> DEVELOPER : ${owner}
> STATUS    : ACCESS GRANTED
> PING      : ${ping} ms
> MEMORY    : ${ram}
> UPTIME    : ${uptime}

> DATE      : ${date}
> TIME      : ${time}

════════════════════════════════════

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `◤ ${category.toUpperCase()} ◢\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `➥ ${prefix}${cmd.name}\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 5) {
                        menu += `   ↳ ${cmd.aliases.slice(i, i + 5).join(", ")}\n`;
                    }

                }

            });

        menu += `═══════════════════════════════\n\n`;

    }

    menu += `
SYSTEM SUMMARY

▸ Commands   : ${commands.length}
▸ Categories : ${Object.keys(grouped).length}
▸ Prefix     : ${prefix}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ FIREWALL ............. ACTIVE
✓ DATABASE ............. CONNECTED
✓ AI CORE .............. ONLINE
✓ SECURITY ............. MAXIMUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

© 2026 KENYA-ULTRA
Lucid Tech Solutions
`;

    return menu;

}
