const commands = new Map();

export function registerCommand(command) {

    if (!command?.name) {
        throw new Error("Command must have a name.");
    }

    commands.set(command.name.toLowerCase(), command);

    if (Array.isArray(command.aliases)) {

        for (const alias of command.aliases) {

            if (alias) {
                commands.set(alias.toLowerCase(), command);
            }

        }

    }

}

export function getCommand(name) {

    return commands.get(name.toLowerCase());

}

export function getCommands() {

    return [...new Set(commands.values())];

}

export function getCategories() {

    return [...new Set(

        getCommands().map(cmd => cmd.category || "Other")

    )].sort();

}

export function getStatistics() {

    const total = getCommands().length;

    return {

        total,

        categories: getCategories().length,

        loaded: total,

        version: "1.0.0"

    };

}

export function getManifest() {

    return {

        platform: "Kenya Ultra",

        version: "1.0.0",

        protocol: 1,

        commandCount: getCommands().length,

        categories: getCategories(),

        generatedAt: Date.now()

    };

}

export default commands;
