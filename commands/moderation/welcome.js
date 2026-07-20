import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "welcome",

    description: "Manage Welcome Messages.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "welcome");

    }

};
