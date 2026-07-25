import CommandRegistry from "../registry/CommandRegistry.js";

class CommandService {

    getCommands() {

        return {

            success: true,

            total: CommandRegistry.count(),

            commands: CommandRegistry.list()

        };

    }

}

export default new CommandService();
