import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antifile",

    description: "Manage Anti-File.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antifile");

    }

};
