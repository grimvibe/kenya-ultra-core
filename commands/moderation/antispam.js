import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antispam",

    description: "Manage Anti-Spam.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antispam");

    }

};
