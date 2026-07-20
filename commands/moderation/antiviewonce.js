import { toggleFeature } from "../../services/groupService.js";

export default {

    name: "antiviewonce",

    description: "Manage Anti-ViewOnce.",

    category: "Moderation",

    async execute(ctx) {

        return toggleFeature(ctx, "antiviewonce");

    }

};
