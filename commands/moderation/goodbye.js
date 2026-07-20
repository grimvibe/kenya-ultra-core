import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "goodbye",

    description: "Manage Goodbye Messages.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "goodbye");

    }

};
