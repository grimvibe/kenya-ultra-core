import { getCommand } from "../commands/index.js";
import Reply from "../utils/reply.js";

class CommandRunner {

    async run(commandName, message) {

        const command = getCommand(commandName);

        if (!command) {
            return Reply.error(`Unknown command: ${commandName}`);
        }

        try {

            const response = await command.execute(message);

            if (!response) {
                return Reply.error(
                    `Command "${commandName}" returned no response.`
                );
            }

            return response;

        } catch (error) {

            console.error(
                `Command "${commandName}" failed:`,
                error
            );

            return Reply.error(
                "An unexpected error occurred while executing this command."
            );

        }

    }

}

export default new CommandRunner();
