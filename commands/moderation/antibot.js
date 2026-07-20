import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antibot",

    description: "Manage Anti-Bot.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antibot");

    }

};
