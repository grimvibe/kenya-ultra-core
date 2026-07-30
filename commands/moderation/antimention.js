import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antimention",

    description: "Manage Anti-Mention.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antimention");

    }

};
