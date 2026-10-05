export default function style3(data) {

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
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ◢ K E N Y A - U L T R A ◣
┃      CYBER TERMINAL
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> USER     :: ${user}
> OWNER    :: ${owner}
> VERSION  :: ${version}
> STATUS   :: ONLINE
> LATENCY  :: ${ping} ms
> MEMORY   :: ${ram}
> UPTIME   :: ${uptime}

> DATE     :: ${date}
> TIME     :: ${time}

═══════════════════════════════

`;

    for (const category of Object.keys(grouped).sort()) {

        menu += `【 ${category.toUpperCase()} 】\n`;

        grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cmd => {

                menu += `➜ ${prefix}${cmd.name}\n`;

                if (cmd.aliases?.length) {

                    for (let i = 0; i < cmd.aliases.length; i += 5) {
                        menu += `   ↳ ${cmd.aliases.slice(i, i + 5).join(", ")}\n`;
                    }

                }

            });

        menu += `────────────────────────────\n`;

    }

    menu += `
═══════════════════════════════

TOTAL COMMANDS  :: ${commands.length}
CATEGORIES      :: ${Object.keys(grouped).length}
PREFIX          :: ${prefix}
ENGINE          :: KENYA-ULTRA CORE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM READY ✓
NO THREATS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

© 2026 Lucid Tech Solutions
`;

    return menu;

}
