import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antinum",

    description: "Manage Anti-Num.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antinum");

    }

};
