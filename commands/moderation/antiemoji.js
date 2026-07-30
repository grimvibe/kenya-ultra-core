import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antiemoji",

    description: "Manage Anti-Emoji.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antiemoji");

    }

};
