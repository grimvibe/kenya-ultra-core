import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antiphoto",

    description: "Manage Anti-Photo.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antiphoto");

    }

};
