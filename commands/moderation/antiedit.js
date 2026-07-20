import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antiedit",

    description: "Manage Anti-Edit.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antiedit");

    }

};
