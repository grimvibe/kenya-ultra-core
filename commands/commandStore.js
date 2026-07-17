const commands = new Map();

export function getCommand(name) {
    return commands.get(name.toLowerCase());
}

export function getCommands() {
    return [...commands.values()];
}

export default commands;
