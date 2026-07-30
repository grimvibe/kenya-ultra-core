import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antisale",

    description: "Manage Anti-Sale.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antisale");

    }

};
