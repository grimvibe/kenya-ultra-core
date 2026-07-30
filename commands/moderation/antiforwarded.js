import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antiforwarded",

    description: "Manage Anti-Forwarded.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antiforwarded");

    }

};
