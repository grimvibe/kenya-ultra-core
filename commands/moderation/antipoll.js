import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antipoll",

    description: "Manage Anti-Poll.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antipoll");

    }

};
