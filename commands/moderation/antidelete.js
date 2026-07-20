import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antidelete",

    description: "Manage Anti-Delete.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antidelete");

    }

};
