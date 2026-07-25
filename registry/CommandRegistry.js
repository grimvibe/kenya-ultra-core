import fs from "fs";
import path from "path";

class CommandRegistry {

    constructor() {

        this.commands = [];

    }

    async load() {

        const commandsPath = path.join(process.cwd(), "commands");

        const files = fs.readdirSync(commandsPath);

        this.commands = [];

        for (const file of files) {

            if (!file.endsWith(".js")) continue;

            const module = await import(`../commands/${file}`);

            const command = module.default || module.command || module;

            if (!command) continue;

            this.commands.push(command);

        }

        return this.commands;

    }

    list() {

        return this.commands;

    }

    count() {

        return this.commands.length;

    }

}

export default new CommandRegistry();
