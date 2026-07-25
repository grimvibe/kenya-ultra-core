import CommandRegistry from "../registry/CommandRegistry.js";

class ManifestService {

    getManifest() {

        return {

            success: true,

            platform: "Kenya Ultra",

            protocol: 1,

            version: "1.0.0",

            commands: {

                total: CommandRegistry.count(),

                endpoint: "/commands"

            },

            endpoints: {

                pair: "/pair",

                validate: "/validate",

                execute: "/execute"

            }

        };

    }

}

export default new ManifestService();
