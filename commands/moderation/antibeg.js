import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antibeg",

    description: "Manage Anti-Beg.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antibeg");

    }

};
