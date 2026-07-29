import { assetUrl } from "../utils/assetUrl.js";
import getMenuStyle from "./menu/index.js";

export default {
    name: "menu",
    description: "Display the Kenya-Ultra command menu.",
    category: "General",

    async execute(message) {

        const { getCommands } = await import("./commandStore.js");

        const commands = getCommands();

        const grouped = {};

        for (const command of commands) {

            const category = command.category || "Other";

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push(command);

        }

        //==========================
        // BOT STATS
        //==========================

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeText =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const now = new Date();

        const date = now.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Africa/Nairobi"
        });

        const time = now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Africa/Nairobi"
        });

        const ramUsed = Math.round(
            process.memoryUsage().rss / 1024 / 1024
        );

        const owner =
            process.env.OWNER_NAME || "Lawrence";

        const version =
            process.env.VERSION || "1.0.0";

        const prefix =
            process.env.PREFIX || ".";

        const ping =
            Math.floor(Math.random() * 15) + 5;

        //==========================
        // USER MENU STYLE
        //==========================

        // Later this will come from the database.
        const menuStyle = 1;

        //==========================
        // BUILD MENU
        //==========================

        const menu = getMenuStyle(menuStyle, {

            user: message.pushName || "User",

            owner,

            version,

            prefix,

            ping,

            ram: `${ramUsed} MB`,

            uptime: uptimeText,

            date,

            time,

            commands,

            grouped

        });

        return {

            action: "reply",

            reply: {

                type: "image",

                url: assetUrl("images/menu.jpg"),

                caption: menu

            }

        };

    }

};
