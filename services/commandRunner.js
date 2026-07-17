import { getCommand } from "../commands/index.js";

class CommandRunner {

    async run(commandName, options = {}) {

        const command = getCommand(commandName);

        if (!command) {
            throw new Error(`Unknown command: ${commandName}`);
        }

        try {

            const result = await command.execute(options);

            return {
                success: true,
                command: command.name,
                category: command.category,
                result
            };

        } catch (error) {

            console.error(`❌ Command "${commandName}" failed:`, error);

            return {
                success: false,
                command: command.name,
                message: error.message || "Command execution failed."
            };

        }

    }

}

export default new CommandRunner();
