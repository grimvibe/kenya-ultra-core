import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antigif",

    description: "Manage Anti-Gif.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antigif");

    }

};
