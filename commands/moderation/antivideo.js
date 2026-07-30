import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antivideo",

    description: "Manage Anti-Video.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antivideo");

    }

};
