const commands = new Map();

export function registerCommand(command) {

    if (!command?.name) {
        throw new Error("Command must have a name.");
    }

    commands.set(command.name.toLowerCase(), command);

}

export function getCommand(name) {

    return commands.get(name.toLowerCase());

}

export function getCommands() {

    return [...commands.values()];

}

export function getCategories() {

    return [...new Set(

        getCommands().map(cmd => cmd.category || "Other")

    )].sort();

}

export function getStatistics() {

    return {

        total: commands.size,

        categories: getCategories().length,

        loaded: commands.size,

        version: "1.0.0"

    };

}

export function getManifest() {

    return {

        platform: "Kenya Ultra",

        version: "1.0.0",

        protocol: 1,

        commandCount: commands.size,

        categories: getCategories(),

        generatedAt: Date.now()

    };

}

export default commands;
