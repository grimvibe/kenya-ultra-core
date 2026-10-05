export default {

    name: "ping",

    aliases: ["p"],

    description: "Check bot speed and system status.",

    category: "General",

    async execute() {

        return { action: "ping_probe" };

    }

};
