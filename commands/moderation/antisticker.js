import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antisticker",

    description: "Manage Anti-Sticker.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antisticker");

    }

};
