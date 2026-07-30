import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antivoice",

    description: "Manage Anti-Voice.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antivoice");

    }

};
