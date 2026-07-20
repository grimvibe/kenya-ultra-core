import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antibadword",

    description: "Manage Anti-BadWord.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antibadword");

    }

};
