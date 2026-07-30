import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antitag",

    description: "Manage Anti-Tag.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antitag");

    }

};
