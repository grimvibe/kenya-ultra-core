import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antilocation",

    description: "Manage Anti-Location.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antilocation");

    }

};
